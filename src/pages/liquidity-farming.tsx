import { Button, SimpleGrid, Text, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import PageContent from "components/common/PageContent"
import TokenImage from "components/common/TokenImage"
import useStakingRewards from "hooks/useStakingRewards"
import useTokenData from "hooks/useTokenData"
import useTokenDataWithImage from "hooks/useTokenDataWithImage"
import { useEffect } from "react"

const LiquidityFarmingPage = (): JSX.Element => {
  const { account } = useWeb3React()
  const {
    isValidating,
    data: [liquidityToken0Address, liquidityToken1Address, rewardsTokenAddress],
  } = useStakingRewards()
  const {
    isLoading: isToken0Loading,
    tokenImage: liquidityToken0Image,
    tokenSymbol: liquidityToken0Symbol,
  } = useTokenDataWithImage(liquidityToken0Address)
  const {
    isLoading: isToken1Loading,
    tokenImage: liquidityToken1Image,
    tokenSymbol: liquidityToken1Symbol,
  } = useTokenDataWithImage(liquidityToken1Address)
  const {
    isValidating: isRewardsTokenLoading,
    data: [, rewardsTokenSymbol],
  } = useTokenData(rewardsTokenAddress)

  // DEBUG
  useEffect(() => {
    console.table({
      token0: liquidityToken0Address,
      token1: liquidityToken1Address,
      reward: rewardsTokenAddress,
    })
  }, [liquidityToken0Address, liquidityToken1Address, rewardsTokenAddress])

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
      subTitle="Stake Uniswap V3 Liquidity Pool NFT to earn CLUB"
    >
      {!isValidating && (
        <>
          <VStack spacing={1} fontSize="xl">
            <Text fontWeight="bold">29 days 4 hours 3 minutes left</Text>
            <Text>Pool reward: 20.000 {rewardsTokenSymbol}</Text>
          </VStack>

          <SimpleGrid gridTemplateColumns="1fr 1fr" gap={8}>
            <VStack>
              <Text as="span" fontSize="3xl">
                3.21
              </Text>
              <Text as="span">Staked liquidity</Text>
            </VStack>

            <VStack>
              <Text as="span" fontSize="3xl">
                0.00
              </Text>
              <Text as="span">Unclaimed {rewardsTokenSymbol}</Text>
            </VStack>
          </SimpleGrid>

          <SimpleGrid
            gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
            gap={2}
            pt={4}
          >
            <Button letterSpacing="wide" colorScheme="seedclub">
              Stake
            </Button>

            <Button letterSpacing="wide" colorScheme="gray" variant="outline">
              Claim & Unstake
            </Button>
          </SimpleGrid>
        </>
      )}

      {(!account || isValidating) && (
        <Text fontSize="xl">Please connect your wallet in order to continue!</Text>
      )}
    </PageContent>
  )
}

export default LiquidityFarmingPage
