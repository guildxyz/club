import {
  Button,
  SimpleGrid,
  Skeleton,
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
import useStakingRewards from "components/liquidity-farming/hooks/useStakingRewards"
import useSumLiquidity from "components/liquidity-farming/hooks/useSumLiquidity"
import useSumUnclaimedRewards from "components/liquidity-farming/hooks/useSumUnclaimedRewards"
import useUserNfts from "components/liquidity-farming/hooks/useUserNfts"
import StakeModal from "components/liquidity-farming/StakeModal"
import UnstakeModal from "components/liquidity-farming/UnstakeModal"
import useTokenData from "hooks/useTokenData"
import useTokenDataWithImage from "hooks/useTokenDataWithImage"
import { useMemo, useState } from "react"
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

  const { account } = useWeb3React()
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

  const { data: userNfts } = useUserNfts()

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

  const depositData = useMemo(() => {
    if (!userNfts || !depositTransferred) return []

    return (
      depositTransferred
        ?.filter(unique)
        .filter((nft) => nft.canStake)
        .filter(
          (deposit) =>
            !userNfts?.map((nft) => nft.tokenId)?.includes(deposit.tokenId)
        ) || []
    )
  }, [depositTransferred, userNfts])

  const sumLiquidity = useSumLiquidity(
    depositData?.map((deposit) => deposit.tokenId)
  )
  const sumUnclaimedRewards = useSumUnclaimedRewards(
    depositData?.map((deposit) => deposit.tokenId)
  )

  // Managing skeleton loaders' state
  const isIncentiveDataLoaded = useMemo(
    () =>
      !!nftName && !!rewardTokenSymbol && incentiveData && !isValidating && !ended,
    [nftName, rewardTokenSymbol, incentiveData, isValidating, ended]
  )

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
      subTitle={
        account &&
        !ended && (
          <Skeleton isLoaded={isIncentiveDataLoaded}>
            <Text colorScheme="gray">
              {`Stake ${nftName} to earn ${rewardTokenSymbol}`}
            </Text>
          </Skeleton>
        )
      }
    >
      {account && !ended && (
        <>
          <VStack spacing={1} fontSize="xl">
            <Skeleton isLoaded={isIncentiveDataLoaded}>
              <Countdown
                timestamp={parseFloat(incentiveKey.endTime)}
                endText="Liquidity Farming ended"
                long
                onEnd={() => setEnded(true)}
              />
            </Skeleton>

            <Skeleton isLoaded={isIncentiveDataLoaded}>
              <Text>
                Pool reward: {formatUnits(incentiveData?.args?.reward || 0, 18)}{" "}
                {rewardTokenSymbol}
              </Text>
            </Skeleton>
          </VStack>

          <SimpleGrid gridTemplateColumns="1fr 1fr" gap={8}>
            <VStack>
              <Skeleton isLoaded={isIncentiveDataLoaded}>
                <Text as="span" fontSize="3xl">
                  {sumLiquidity}
                </Text>
              </Skeleton>
              <Skeleton isLoaded={isIncentiveDataLoaded}>
                <Text as="span">Staked liquidity</Text>
              </Skeleton>
            </VStack>

            <VStack>
              <Skeleton isLoaded={isIncentiveDataLoaded} minWidth={16}>
                <Text as="span" fontSize="3xl">
                  {sumUnclaimedRewards}
                </Text>
              </Skeleton>

              <Skeleton isLoaded={isIncentiveDataLoaded} minWidth={16}>
                <Text as="span">Unclaimed {rewardTokenSymbol}</Text>
              </Skeleton>
            </VStack>
          </SimpleGrid>

          <SimpleGrid
            gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
            gap={2}
            pt={4}
          >
            <Skeleton isLoaded={isIncentiveDataLoaded}>
              <Button
                letterSpacing="wide"
                colorScheme="seedclub"
                onClick={onNftListModalOpen}
              >
                Deposit & Stake
              </Button>
            </Skeleton>

            <Skeleton isLoaded={isIncentiveDataLoaded}>
              <Button
                isDisabled={!depositData || depositData.length === 0}
                letterSpacing="wide"
                colorScheme="gray"
                variant="outline"
                onClick={onDepositNftsModalOpen}
              >
                Claim & Unstake
              </Button>
            </Skeleton>
          </SimpleGrid>
        </>
      )}

      {!account && !ended && (
        <Text fontSize="xl">Please connect your wallet in order to continue!</Text>
      )}
      {ended && (
        <>
          <Text fontSize="xl">This incentive has ended!</Text>
          {depositData?.length > 0 && (
            <Button
              colorScheme="seedclub"
              letterSpacing="wide"
              onClick={onDepositNftsModalOpen}
            >
              Claim rewards & Unstake NFTs
            </Button>
          )}
        </>
      )}

      <StakeModal isOpen={isNftListModalOpen} onClose={onNftListModalClose} />
      <UnstakeModal
        isOpen={isDepositNftsModalOpen}
        onClose={onDepositNftsModalClose}
        depositData={depositData}
      />

      {process.env.NODE_ENV === "development" && (
        <SimpleGrid
          gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
          gap={2}
          pt={4}
        >
          <Button isLoading={isCreateIncentiveLoading} onClick={onCreateIncentive}>
            Create Incentive
          </Button>
          <Button isLoading={isEndIncentiveLoading} onClick={onEndIncentive}>
            End Incentive
          </Button>
        </SimpleGrid>
      )}
    </PageContent>
  )
}

export default LiquidityFarmingPage
