import { Box, Button, SimpleGrid, Text, VStack } from "@chakra-ui/react"
import PageContent from "components/common/PageContent"

const LiquidityFarmingPage = (): JSX.Element => (
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
        <Box
          boxSize={16}
          bgColor="gray.300"
          rounded="full"
          borderWidth={3}
          borderColor="seedclub.white"
        />
        <Box
          boxSize={16}
          bgColor="gray.300"
          rounded="full"
          borderWidth={3}
          borderColor="seedclub.white"
        />
      </SimpleGrid>
    }
    subTitle="Stake Uniswap V3 Liquidity Pool NFT to earn CLUB"
  >
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

    <SimpleGrid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={2} pt={4}>
      <Button letterSpacing="wide" colorScheme="seedclub">
        Stake
      </Button>

      <Button letterSpacing="wide" colorScheme="gray" variant="outline">
        Claim & Unstake
      </Button>
    </SimpleGrid>
  </PageContent>
)

export default LiquidityFarmingPage
