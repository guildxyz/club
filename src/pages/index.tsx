import { Button, Heading, Text, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import JoinCommunity from "components/common/JoinCommunity"
import Layout from "components/common/Layout"

const Page = (): JSX.Element => (
  <Layout title="Airdrop">
    <Card p={8} fontFamily="display">
      <VStack spacing={8} fontWeight="semibold" textAlign="center">
        <Heading as="h1" fontFamily="display" fontSize={{ base: "4xl", md: "5xl" }}>
          Seed Club Airdrop
        </Heading>

        <Text fontSize="4xl">22:40:58</Text>

        <VStack spacing={1} fontSize="xl" pb={4}>
          <Text>You are on the whitelist</Text>
          <Text>2 $CLUB waiting to be claimed</Text>
        </VStack>

        <Button px={8} letterSpacing="wide" colorScheme="seedclub">
          Claim
        </Button>

        <JoinCommunity />
      </VStack>
    </Card>
  </Layout>
)

export default Page
