import { Text } from "@chakra-ui/react"
import Link from "components/common/Link"
import LinkButton from "components/common/LinkButton"
import PageContent from "components/common/PageContent"

const TheDao20AwardsPage = () => (
  <PageContent px={{ base: 2, sm: 12 }} py={12} layoutTitle="The DAO 20 Awards">
    <Text>
      To give everyone the opportunity to be included in the airdrop, we're opening
      up applications for the final 20 spots.
    </Text>
    <Text>
      Submit your pitch by Dec 28 and $CLUB holders will vote on who they want to
      join the DAO. Top 20 vote getters will receive $CLUB.
    </Text>

    <Text pt={2} pb={6}>
      <Link href="#" target="_blank" textDecoration="underline">
        More details here
      </Link>
    </Text>

    <LinkButton
      href="https://airtable.com/shrk8N2DBl7q87jn5"
      size="xl"
      colorScheme="seedclub"
      letterSpacing="wide"
    >
      Enter DAO 20 race
    </LinkButton>
  </PageContent>
)

export default TheDao20AwardsPage
