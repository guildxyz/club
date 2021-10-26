import { Button, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import JoinCommunity from "components/common/JoinCommunity"
import Layout from "components/common/Layout"

const LiquidityFarmingPage = (): JSX.Element => (
  <Layout title="Liquidity Farming">
    <Card p={8} fontFamily="display">
      <VStack spacing={8} fontWeight="semibold" textAlign="center">
        <VStack spacing={2}>
          <Heading
            as="h1"
            fontFamily="display"
            fontSize={{ base: "4xl", md: "5xl" }}
          >
            Seed Club <br />
            Liquidity Farming
          </Heading>
          <Text colorScheme="gray">
            Stake Uniswap V3 Liquidity Pool NFT to earn CLUB
          </Text>
        </VStack>

        <VStack spacing={1} fontSize="xl">
          <Text fontWeight="bold">29 days 4 hours 3 minutes left</Text>
          <Text>Pool reward: 20.000 CLUB</Text>
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
            <Text as="span">Unclaimed CLUB</Text>
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

        <JoinCommunity />
      </VStack>
    </Card>
  </Layout>
)

export default LiquidityFarmingPage
