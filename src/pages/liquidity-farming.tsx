import {
  Button,
  Flex,
  HStack,
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
import useCreateIncentive from "components/liquidity-farming/hooks/useCreateIncentive"
import useEndIncentive from "components/liquidity-farming/hooks/useEndIncentive"
import useStakeNft from "components/liquidity-farming/hooks/useStakeNft"
import useStakingRewards from "components/liquidity-farming/hooks/useStakingRewards"
import useSumLiquidity from "components/liquidity-farming/hooks/useSumLiquidity"
import useSumUnclaimedRewards from "components/liquidity-farming/hooks/useSumUnclaimedRewards"
import useUnstakeWithdrawClaim from "components/liquidity-farming/hooks/useUnstakeWithdrawClaim"
import useUserNfts from "components/liquidity-farming/hooks/useUserNfts"
import useTokenData from "hooks/useTokenData"
import useTokenDataWithImage from "hooks/useTokenDataWithImage"
import { useEffect, useMemo, useState } from "react"
import { mutate } from "swr"
import incentiveKey from "temporaryData/incentiveKey"
import unique from "utils/uniqueFilter"

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
  } = useTokenData(process.env.NEXT_PUBLIC_REWARD_TOKEN_ADDRESS)
  const {
    isLoading: isToken0Loading,
    tokenSymbol: liquidityToken0Symbol,
    tokenImage: liquidityToken0Image,
  } = useTokenDataWithImage(process.env.NEXT_PUBLIC_TOKEN0_ADDRESS)
  const {
    isLoading: isToken1Loading,
    tokenSymbol: liquidityToken1Symbol,
    tokenImage: liquidityToken1Image,
  } = useTokenDataWithImage(process.env.NEXT_PUBLIC_TOKEN1_ADDRESS)

  const [ended, setEnded] = useState(false)

  const { isValidating: isUserNftsLoading, data: userNfts } = useUserNfts(account)

  const {
    isValidating,
    data: [incentiveInfo, depositTransferred, nftName],
  } = useStakingRewards()

  const incentiveData = useMemo(
    () =>
      incentiveInfo?.find(
        (i) => parseFloat(i.args.endTime) === parseFloat(incentiveKey.endTime)
      ),
    [incentiveInfo]
  )

  const depositData = useMemo(
    () =>
      depositTransferred
        ?.filter(unique)
        ?.filter((tokenId) => !userNfts?.includes(tokenId)) || [],
    [depositTransferred, userNfts]
  )

  const sumLiquidity = useSumLiquidity(depositData)
  const sumUnclaimedRewards = useSumUnclaimedRewards(depositData)

  const [pickedStakeNft, setPickedStakeNft] = useState(null)
  const [pickedUnstakeNft, setPickedUnstakeNft] = useState(null)

  const {
    isLoading: isStakeNftLoading,
    onSubmit: onDepositAndStake,
    response: depositAndStakeResponse,
  } = useStakeNft(pickedStakeNft)

  useEffect(() => {
    if (depositAndStakeResponse) {
      setPickedStakeNft(null)
      onNftListModalClose()
      setTimeout(() => {
        mutate(active ? ["stakingRewards", chainId, account] : null)
        mutate(active ? ["nfts", chainId, account] : null)
      }, 10000)
    }
  }, [depositAndStakeResponse])

  const {
    isLoading: isClaimLoading,
    onSubmit: onClaimSubmit,
    response: claimResponse,
  } = useUnstakeWithdrawClaim(pickedUnstakeNft)

  useEffect(() => {
    if (claimResponse) {
      setPickedUnstakeNft(null)
      onDepositNftsModalClose()
      setTimeout(() => {
        mutate(active ? ["stakingRewards", chainId, account] : null)
        mutate(active ? ["nfts", chainId, account] : null)
      }, 10000)
    }
  }, [claimResponse])

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
      {incentiveData && !isValidating && !ended && (
        <>
          <VStack spacing={1} fontSize="xl">
            <Countdown
              timestamp={parseFloat(incentiveKey.endTime)}
              endText="Liquidity Farming ended"
              long
              onEnd={() => setEnded(true)}
            />
            <Text>
              Pool reward: {formatUnits(incentiveData.args?.reward, 18)}{" "}
              {rewardTokenSymbol}
            </Text>
          </VStack>

          <SimpleGrid gridTemplateColumns="1fr 1fr" gap={8}>
            <VStack>
              <Text as="span" fontSize="3xl">
                {parseFloat(sumUnclaimedRewards) > 0.0 ? sumLiquidity : "-"}
              </Text>
              <Text as="span">Staked liquidity</Text>
            </VStack>

            <VStack>
              <Text as="span" fontSize="3xl">
                {parseFloat(sumUnclaimedRewards) > 0.0 ? sumUnclaimedRewards : "-"}
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
              isDisabled={!depositData || depositData.length === 0}
              letterSpacing="wide"
              colorScheme="gray"
              variant="outline"
              isLoading={isClaimLoading}
              loadingText="Claiming"
              onClick={onDepositNftsModalOpen}
            >
              Claim & Unstake
            </Button>
          </SimpleGrid>
        </>
      )}

      {(!account || isValidating) && !ended && (
        <Text fontSize="xl">Please connect your wallet in order to continue!</Text>
      )}

      {ended && (
        <>
          <Text fontSize="xl">This incentive has ended!</Text>
          {depositData?.length > 0 && (
            <Button
              colorScheme="seedclub"
              letterSpacing="wide"
              isLoading={isClaimLoading}
              loadingText="Claiming"
              onClick={onDepositNftsModalOpen}
            >
              Claim rewards & Unstake NFTs
            </Button>
          )}
        </>
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
                  userNfts.map((nft) => (
                    <Button
                      key={nft}
                      isFullWidth
                      size="xl"
                      justifyContent="start"
                      boxSizing="border-box"
                      borderColor="seedclub.green.700"
                      borderWidth={pickedStakeNft === nft ? 3 : 0}
                      onClick={() => setPickedStakeNft(nft)}
                    >
                      {nft}
                    </Button>
                  ))
                ) : (
                  <Text>Seems like you don't have any NFTs.</Text>
                )}
              </VStack>
            )}

            {pickedStakeNft && (
              <ScaleFade in={pickedStakeNft}>
                <Text my={4}>
                  In order to earn {rewardTokenSymbol} rewards, you must deposit this
                  NFT to the Uniswap Staking contract, and stake it in Seed Club's
                  farm.
                </Text>
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
                  loadingText="Staking"
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
                      boxSizing="border-box"
                      borderColor="seedclub.green.700"
                      borderWidth={pickedUnstakeNft === nft ? 3 : 0}
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
                <HStack mt={4} spacing={3}>
                  <Button
                    fontFamily="display"
                    w="max-content"
                    colorScheme="gray"
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
                    isLoading={isClaimLoading}
                    loadingText="Claiming"
                    colorScheme="seedclub"
                    onClick={onClaimSubmit}
                  >
                    Claim & unstake
                  </Button>
                </HStack>
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
