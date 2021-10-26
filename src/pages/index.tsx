import { Button, Heading, Text, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import JoinCommunity from "components/common/JoinCommunity"
import Layout from "components/common/Layout"
import { GetStaticProps } from "next"
import { Data } from "temporaryData/types"

type Props = {
  data: Data[]
}

const Page = ({ data: dataInitial }: Props): JSX.Element => {
  // const { data } = useSWR("data", fetchData, {
  //   fallbackData: dataInitial,
  // })

  return (
    <Layout title="Airdrop">
      <Card mx="auto" maxW="container.sm" p={8} fontFamily="display">
        <VStack spacing={8} fontWeight="semibold" textAlign="center">
          <Heading as="h1" fontFamily="display" fontSize="5xl">
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
}

export const getStaticProps: GetStaticProps = async () => {
  // const data = await fetchData()

  return {
    props: { data: {} },
    revalidate: 10,
  }
}

export default Page
