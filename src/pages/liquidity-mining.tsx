import {
  Button,
  HStack,
  Icon,
  SimpleGrid,
  Skeleton,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import CircleTooltip from "components/common/CircleTooltip"
import Link from "components/common/Link"
import PageContent from "components/common/PageContent"
import useCreateIncentive from "components/liquidity-mining/hooks/useCreateIncentive"
import useEndIncentive from "components/liquidity-mining/hooks/useEndIncentive"
import useStakingRewards from "components/liquidity-mining/hooks/useStakingRewards"
import useSumUnclaimedRewards from "components/liquidity-mining/hooks/useSumUnclaimedRewards"
import useUserNfts from "components/liquidity-mining/hooks/useUserNfts"
import StakeModal from "components/liquidity-mining/StakeModal"
import UnstakeModal from "components/liquidity-mining/UnstakeModal"
import incentiveKey from "data/incentiveKey"
import useTokenData from "hooks/useTokenData"
import { Info } from "phosphor-react"
import { useMemo, useState } from "react"
import unique from "utils/uniqueFilter"

const LiquidityFarmingPage = (): JSX.Element => {
  const buttonSize = useBreakpointValue({ base: "sm", sm: "xl" })

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
  const {
    data: [, liquidityToken0Symbol],
  } = useTokenData(process.env.NEXT_PUBLIC_TOKEN0_ADDRESS)

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

  const ended = useMemo(
    () =>
      incentiveKey?.endTime
        ? parseInt(incentiveKey.endTime) * 1000 <= Date.now()
        : true,
    []
  )

  return (
    <PageContent
      px={{ base: 0, sm: 1 }}
      pt={6}
      pb={10}
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
          <Text>
            {`Deposit your Uniswap V3 NFT into the Staking contract to start earning ${liquidityToken0Symbol} Rewards.`}
          </Text>
          <Text>
            <Link
              href="https://club.mirror.xyz/6oGZxfK787Yj3qNkyyrVrYzhM7TluZDfZ_e5bteyk2A"
              textDecoration="underline"
            >
              Read this post
            </Link>{" "}
            to learn more
          </Text>

          <VStack spacing={{ base: 0, sm: 2 }}>
            <SimpleGrid
              width="full"
              mb={{ base: 0.5, sm: 2 }}
              pt={8}
              gap={{ base: 1, sm: 4 }}
              gridTemplateColumns={{ base: "70% 30%", sm: "65% 35%" }}
            >
              <Skeleton isLoaded={isIncentiveDataLoaded}>
                <Text
                  h={10}
                  fontSize={{ base: "1.25rem", sm: "2.25rem" }}
                  textAlign="right"
                  fontFamily="heading"
                  lineHeight={{ base: 2, sm: 1.5 }}
                >{`${depositData?.length} Staked NFT(s)`}</Text>
              </Skeleton>

              <HStack spacing={{ base: 0.5, sm: 2 }}>
                <Button
                  size={buttonSize}
                  width="full"
                  letterSpacing="wide"
                  colorScheme="seedclub"
                  onClick={onNftListModalOpen}
                >
                  Stake
                </Button>
                <CircleTooltip
                  label="Staking will deposit your NFT into the Uniswap V3 Staking contract and start earning you rewards."
                  placement="right"
                  boxSize={96}
                  minW={96}
                >
                  <Icon as={Info} boxSize={5} />
                </CircleTooltip>
              </HStack>
            </SimpleGrid>

            <SimpleGrid
              width="full"
              gap={{ base: 1, sm: 4 }}
              gridTemplateColumns={{ base: "70% 30%", sm: "65% 35%" }}
            >
              <Skeleton isLoaded={isIncentiveDataLoaded}>
                <Text
                  h={10}
                  fontSize={{ base: "1.25rem", sm: "2.25rem" }}
                  textAlign="right"
                  fontFamily="heading"
                  lineHeight={{ base: 2, sm: 1.5 }}
                >{`${sumUnclaimedRewards} Pending Rewards`}</Text>
              </Skeleton>
              <HStack spacing={{ base: 0.5, sm: 2 }}>
                <Button
                  size={buttonSize}
                  width="full"
                  isDisabled={!depositData || depositData.length === 0}
                  letterSpacing="wide"
                  colorScheme="seedclub"
                  onClick={() => {
                    setClaimMode("unstakeWithdrawClaim")
                    onDepositNftsModalOpen()
                  }}
                >
                  Claim
                </Button>
                <CircleTooltip
                  label="Claiming rewards will unstake your NFT. We recommend only doing this when you're ready to claim a lump sum of rewards as the gas cost will likely be high."
                  placement="right"
                  boxSize={96}
                  minW={96}
                >
                  <Icon as={Info} boxSize={5} />
                </CircleTooltip>
              </HStack>
            </SimpleGrid>
          </VStack>
        </>
      )}

      {ended && (
        <>
          <Text>This incentive has ended!</Text>
          {depositData?.length > 0 && (
            <Button
              size="xl"
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
