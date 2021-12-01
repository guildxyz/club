import { Button, SimpleGrid, Skeleton, Text, useDisclosure } from "@chakra-ui/react"
import Link from "components/common/Link"
import PageContent from "components/common/PageContent"
import useCreateIncentive from "components/liquidity-farming/hooks/useCreateIncentive"
import useEndIncentive from "components/liquidity-farming/hooks/useEndIncentive"
import useStakingRewards from "components/liquidity-farming/hooks/useStakingRewards"
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

  const {
    data: [, rewardTokenSymbol],
  } = useTokenData(process.env.NEXT_PUBLIC_REWARD_TOKEN_ADDRESS)
  const { tokenSymbol: liquidityToken0Symbol } = useTokenDataWithImage(
    process.env.NEXT_PUBLIC_TOKEN0_ADDRESS
  )
  const { tokenSymbol: liquidityToken1Symbol } = useTokenDataWithImage(
    process.env.NEXT_PUBLIC_TOKEN1_ADDRESS
  )

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

  const sumUnclaimedRewards = useSumUnclaimedRewards(
    depositData?.map((deposit) => deposit.tokenId)
  )

  // Managing skeleton loaders' state
  const isIncentiveDataLoaded = useMemo(
    () => !!nftName && !!rewardTokenSymbol && incentiveData && !isValidating,
    [nftName, rewardTokenSymbol, incentiveData, isValidating]
  )

  // For development testing only!
  const { isLoading: isCreateIncentiveLoading, onSubmit: onCreateIncentive } =
    useCreateIncentive()
  const { isLoading: isEndIncentiveLoading, onSubmit: onEndIncentive } =
    useEndIncentive()

  const [claimMode, setClaimMode] = useState<"claim" | "unstakeWithdrawClaim">(
    "unstakeWithdrawClaim"
  )

  const formatDate = (unixTimestamp: number) => {
    const date = new Date(unixTimestamp * 1000)
    return date.toLocaleDateString()
  }

  const ended = useMemo(
    () => false,
    // incentiveKey?.endTime
    //   ? parseInt(incentiveKey.endTime) * 1000 >= Date.now()
    //   : true,
    []
  )

  return (
    <PageContent
      title={
        <>
          Seed Club <br />
          Liquidity Mining
        </>
      }
      layoutTitle="Liquidity Mining"
    >
      {!ended && (
        <>
          <Skeleton isLoaded={isIncentiveDataLoaded}>
            <Text>{formatDate(parseInt(incentiveKey.endTime))}</Text>
          </Skeleton>

          <Text fontSize="xl">
            {`Earn rewards for supplying liquidity for $${liquidityToken0Symbol} on Uniswap V3. Learn more
            here.`}
          </Text>

          <Link href="#" fontSize="xl" textDecoration="underline">
            Learn more here
          </Link>

          <SimpleGrid
            width="full"
            gap={4}
            gridTemplateColumns={{ base: "1fr", md: "5fr 2fr" }}
          >
            <Text
              h="var(--chakra-sizes-11)"
              fontSize="3xl"
              textAlign="right"
              fontFamily="display"
              fontWeight="semibold"
            >{`${depositData?.length} Staked NFTs`}</Text>

            {depositData?.length > 0 ? (
              <Button
                width="full"
                isDisabled={!depositData || depositData.length === 0}
                letterSpacing="wide"
                colorScheme="seedclub"
                onClick={() => {
                  setClaimMode("unstakeWithdrawClaim")
                  onDepositNftsModalOpen()
                }}
              >
                Claim &amp; unstake
              </Button>
            ) : (
              <Button
                letterSpacing="wide"
                colorScheme="seedclub"
                onClick={onNftListModalOpen}
              >
                Deposit &amp; Stake
              </Button>
            )}
          </SimpleGrid>

          <SimpleGrid
            width="full"
            gap={4}
            gridTemplateColumns={{ base: "1fr", md: "5fr 2fr" }}
          >
            <Text
              h="var(--chakra-sizes-11)"
              fontSize="3xl"
              textAlign="right"
              fontFamily="display"
              fontWeight="semibold"
            >{`${sumUnclaimedRewards} pending rewards`}</Text>
            <Button
              width="full"
              isDisabled={!depositData || depositData.length === 0}
              letterSpacing="wide"
              colorScheme="seedclub"
              onClick={() => {
                setClaimMode("claim")
                onDepositNftsModalOpen()
              }}
            >
              Claim
            </Button>
          </SimpleGrid>
        </>
      )}

      {ended && (
        <>
          <Text fontSize="xl">This incentive has ended!</Text>
          {depositData?.length > 0 && (
            <Button
              colorScheme="seedclub"
              letterSpacing="wide"
              onClick={() => {
                setClaimMode("unstakeWithdrawClaim")
                onDepositNftsModalOpen()
              }}
            >
              Claim rewards &amp; Unstake NFTs
            </Button>
          )}
        </>
      )}

      <StakeModal isOpen={isNftListModalOpen} onClose={onNftListModalClose} />
      <UnstakeModal
        isOpen={isDepositNftsModalOpen}
        onClose={onDepositNftsModalClose}
        depositData={depositData}
        claimMode={claimMode}
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
