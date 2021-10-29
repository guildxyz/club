import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import PageContent from "components/common/PageContent"
import TokenImage from "components/common/TokenImage"
import Countdown from "components/index/Countdown"
import useClaimAndUnstake from "components/liquidity-farming/hooks/useClaimAndUnstake"
import useCreateIncentive from "components/liquidity-farming/hooks/useCreateIncentive"
import useEndIncentive from "components/liquidity-farming/hooks/useEndIncentive"
import useStakeNft from "components/liquidity-farming/hooks/useStakeNft"
import useStakingRewards from "components/liquidity-farming/hooks/useStakingRewards"
import useSumLiquidity from "components/liquidity-farming/hooks/useSumLiquidity"
import useUserNfts from "components/liquidity-farming/hooks/useUserNfts"
import useTokenData from "hooks/useTokenData"
import useTokenDataWithImage from "hooks/useTokenDataWithImage"
import { useEffect, useMemo, useState } from "react"
import { mutate } from "swr"
import dev from "temporaryData/dev"

const TEMP_REWARD_TOKEN_ADDRESS = "0x3c65d35a8190294d39013287b246117ebf6615bd"
const unique = (value, index, self): boolean => self.indexOf(value) === index

const LiquidityFarmingPage = (): JSX.Element => {
  // Modals
  const {
    onOpen: onNftListModalOpen,
    onClose: onNftListModalClose,
    isOpen: isNftListModalOpen,
  } = useDisclosure()
  const {
    onOpen: onDepositNftsModalOpen,
    onClose: onDepositNftsModalClose,
    isOpen: isDepositNftsModalOpen,
  } = useDisclosure()

  const { active, chainId, account } = useWeb3React()
  const {
    data: [, rewardTokenSymbol],
  } = useTokenData(TEMP_REWARD_TOKEN_ADDRESS)
  const {
    isLoading: isToken0Loading,
    tokenSymbol: liquidityToken0Symbol,
    tokenImage: liquidityToken0Image,
  } = useTokenDataWithImage("ETHER")
  const {
    isLoading: isToken1Loading,
    tokenSymbol: liquidityToken1Symbol,
    tokenImage: liquidityToken1Image,
  } = useTokenDataWithImage("0x6b175474e89094c44da98b954eedeac495271d0f") // DAI

  const { isValidating: isUserNftsLoading, data: userNfts } = useUserNfts(account)

  const {
    isValidating,
    data: [incentiveInfo, depositTransferred, nftName, rewardsOwed, rewardsInfo],
  } = useStakingRewards()

  const incentiveData = useMemo(
    () =>
      incentiveInfo?.find(
        (i) => parseFloat(i.args.endTime) === dev.TEMP_INCENTIVEKEY.endTime
      ),
    [incentiveInfo]
  )

  const depositData = useMemo(() => {
    const userNftIds = userNfts?.map((nftData) => nftData.nft) || []
    return (
      depositTransferred
        ?.map((depo) => (depo?.args?.tokenId ? parseInt(depo.args.tokenId) : null))
        ?.filter(unique)
        ?.filter((tokenId) => !userNftIds.includes(tokenId)) || []
    )
  }, [depositTransferred])

  const sumLiquidity = useSumLiquidity(depositData)

  // DEBUG
  // useEffect(() => {
  //   console.log(incentiveInfo, depositTransferred, nftName, rewardsOwed, rewardsInfo)
  // }, [incentiveInfo, depositTransferred, nftName, rewardsOwed, rewardsInfo])

  const [pickedStakeNft, setPickedStakeNft] = useState(null)
  const [pickedUnstakeNft, setPickedUnstakeNft] = useState(null)

  const {
    isLoading: isStakeNftLoading,
    onSubmit: onDepositAndStake,
    response: depositAndStakeResponse,
  } = useStakeNft(pickedStakeNft)

  useEffect(() => {
    if (depositAndStakeResponse) {
      mutate(active ? ["nfts", chainId, account] : null)
      setPickedStakeNft(null)
      onNftListModalClose()
    }
  }, [depositAndStakeResponse])

  const {
    isLoading: isClaimAndUnstakeLoading,
    onSubmit: onClaimAndUnstakeSubmit,
    response: claimAndUnstakeResponse,
  } = useClaimAndUnstake(pickedUnstakeNft)

  useEffect(() => {
    if (claimAndUnstakeResponse) {
      console.log("claimAndUnstakeResponse", claimAndUnstakeResponse)
      mutate(active ? ["stakingRewards", chainId, account] : null)
      mutate(active ? ["nfts", chainId, account] : null)
      setPickedUnstakeNft(null)
      onDepositNftsModalClose()
    }
  }, [claimAndUnstakeResponse])

  // For development testing only!
  const { isLoading: isCreateIncentiveLoading, onSubmit: onCreateIncentive } =
    useCreateIncentive()
  const { isLoading: isEndIncentiveLoading, onSubmit: onEndIncentive } =
    useEndIncentive()

  return (
    <PageContent
      title={
        <>
          Seed Club <br />
          Liquidity Farming
        </>
      }
      layoutTitle="Liquidity Farming"
      header={
        <SimpleGrid gridTemplateColumns="3rem 3rem">
          {account && (
            <>
              <TokenImage
                isLoading={isToken0Loading}
                tokenSymbol={liquidityToken0Symbol}
                tokenImage={liquidityToken0Image}
              />
              <TokenImage
                isLoading={isToken1Loading}
                tokenSymbol={liquidityToken1Symbol}
                tokenImage={liquidityToken1Image}
              />
            </>
          )}
        </SimpleGrid>
      }
      subTitle={`Stake ${nftName} to earn ${rewardTokenSymbol}`}
    >
      {incentiveData && !isValidating && (
        <>
          <VStack spacing={1} fontSize="xl">
            {/* <Text fontWeight="bold">? days ? hours ? minutes left</Text> */}
            <Countdown
              timestamp={dev.TEMP_INCENTIVEKEY.endTime}
              endText="Oof"
              long
            />
            <Text>
              Pool reward: {formatUnits(incentiveData.args?.reward, 18)}{" "}
              {rewardTokenSymbol}
            </Text>
          </VStack>

          <SimpleGrid gridTemplateColumns="1fr 1fr" gap={8}>
            <VStack>
              <Text as="span" fontSize="3xl">
                {sumLiquidity}
              </Text>
              <Text as="span">Staked liquidity</Text>
            </VStack>

            <VStack>
              <Text as="span" fontSize="3xl">
                {console.log(rewardsOwed, rewardsInfo)}
                {rewardsOwed && rewardsInfo?.reward > 0
                  ? parseFloat(formatUnits(rewardsInfo.reward))?.toFixed(4)
                  : "-"}
              </Text>
              <Text as="span">Unclaimed {rewardTokenSymbol}</Text>
            </VStack>
          </SimpleGrid>

          <SimpleGrid
            gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
            gap={2}
            pt={4}
          >
            <Button
              letterSpacing="wide"
              colorScheme="seedclub"
              onClick={onNftListModalOpen}
            >
              Deposit & Stake
            </Button>

            <Button
              isDisabled={!rewardsOwed || !rewardsInfo?.reward}
              letterSpacing="wide"
              colorScheme="gray"
              variant="outline"
              isLoading={isClaimAndUnstakeLoading}
              onClick={onDepositNftsModalOpen}
            >
              Claim & Unstake
            </Button>
          </SimpleGrid>
        </>
      )}

      {(!account || isValidating) && (
        <Text fontSize="xl">Please connect your wallet in order to continue!</Text>
      )}

      <Modal
        isOpen={isNftListModalOpen}
        onClose={() => {
          onNftListModalClose()
          setPickedStakeNft(null)
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Deposit & Stake</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isUserNftsLoading ? (
              <Flex alignItems="center" justifyContent="center">
                <Spinner size="lg" />
              </Flex>
            ) : (
              <VStack alignItems="start">
                {userNfts?.length > 0 ? (
                  userNfts.map((nftData) => (
                    <Button
                      key={nftData.nft}
                      isFullWidth
                      size="xl"
                      justifyContent="start"
                      onClick={() => setPickedStakeNft(nftData.nft)}
                    >
                      {nftData.nft}
                    </Button>
                  ))
                ) : (
                  <Text>Seems like you don't have any NFTs.</Text>
                )}
              </VStack>
            )}

            {pickedStakeNft && (
              <ScaleFade in={pickedStakeNft}>
                <Text mt={8} mb={4}>
                  In order to earn {rewardTokenSymbol} rewards, you must deposit this
                  NFT to the Uniswap Staking contract, and stake it in Seed Club's
                  farm.
                </Text>
                <Text mb={8}>Picked NFT: {pickedStakeNft}</Text>
                <Button
                  fontFamily="display"
                  w="max-content"
                  colorScheme="gray"
                  mr={3}
                  onClick={() => {
                    onNftListModalClose()
                    setPickedStakeNft(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  fontFamily="display"
                  w="max-content"
                  isLoading={isStakeNftLoading}
                  colorScheme="seedclub"
                  onClick={onDepositAndStake}
                >
                  Deposit & Stake
                </Button>
              </ScaleFade>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDepositNftsModalOpen}
        onClose={() => {
          onDepositNftsModalClose()
          setPickedUnstakeNft(null)
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Claim & Unstake</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isUserNftsLoading ? (
              <Flex alignItems="center" justifyContent="center">
                <Spinner size="lg" />
              </Flex>
            ) : (
              <VStack alignItems="start">
                {depositData?.length > 0 ? (
                  depositData.map((nft) => (
                    <Button
                      key={nft}
                      isFullWidth
                      size="xl"
                      justifyContent="start"
                      onClick={() => setPickedUnstakeNft(nft)}
                    >
                      {nft}
                    </Button>
                  ))
                ) : (
                  <Text>Seems like you don't have any staked NFTs.</Text>
                )}
              </VStack>
            )}

            {pickedUnstakeNft && (
              <ScaleFade in={pickedUnstakeNft}>
                <Text my={8}>Picked NFT: {pickedUnstakeNft}</Text>
                <Button
                  fontFamily="display"
                  w="max-content"
                  colorScheme="gray"
                  mr={3}
                  onClick={() => {
                    onDepositNftsModalClose()
                    setPickedUnstakeNft(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  fontFamily="display"
                  w="max-content"
                  isLoading={isClaimAndUnstakeLoading}
                  colorScheme="seedclub"
                  onClick={onClaimAndUnstakeSubmit}
                >
                  Claim & unstake
                </Button>
              </ScaleFade>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {false && (
        <>
          <Button isLoading={isCreateIncentiveLoading} onClick={onCreateIncentive}>
            Create Incentive
          </Button>
          <Button isLoading={isEndIncentiveLoading} onClick={onEndIncentive}>
            End Incentive
          </Button>
        </>
      )}
    </PageContent>
  )
}

export default LiquidityFarmingPage
