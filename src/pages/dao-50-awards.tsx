import { Button, Text } from "@chakra-ui/react"
import Link from "components/common/Link"
import PageContent from "components/common/PageContent"

const TheDao50AwardsPage = () => (
  <PageContent px={{ base: 2, sm: 12 }} py={12} layoutTitle="The DAO 50 Awards">
    <Text>
      To give everyone the opportunity to be included in the airdrop, we're opening
      up applications for the final 50 spots.
    </Text>
    <Text>
      Submit your pitch by Dec 28 and $CLUB holders will vote on who they want to
      join the DAO. Top 50 vote getters will receive $CLUB.
    </Text>

    <Text pt={2} pb={6}>
      <Link href="#" target="_blank" textDecoration="underline">
        More details here
      </Link>
    </Text>

    <Button size="xl" colorScheme="seedclub" letterSpacing="wide">
      Enter DAO 50 race
    </Button>
  </PageContent>
)

export default TheDao50AwardsPage
