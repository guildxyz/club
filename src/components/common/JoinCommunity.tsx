import { HStack, Icon, Link, VStack } from "@chakra-ui/react"
import { DiscordLogo, TwitterLogo } from "phosphor-react"

type Props = {
  fixed?: boolean
}

const JoinCommunity = ({ fixed }: Props): JSX.Element => (
  <VStack
    position={fixed ? "relative" : { base: "relative", lg: "fixed" }}
    right={fixed ? 0 : { base: 0, lg: 10 }}
    bottom={fixed ? 0 : { base: 0, lg: 8 }}
    mt={{ base: 8, lg: 0 }}
    spacing={2}
  >
    <HStack spacing={2}>
      <Link href="https://twitter.com/seedclubhq" target="_blank" rel="noreferrer">
        <Icon as={TwitterLogo} color="seedclub.white" boxSize={8} />
      </Link>

      <Link href="https://discord.gg/42UjJskuEF" target="_blank" rel="noreferrer">
        <Icon as={DiscordLogo} color="seedclub.white" boxSize={8} />
      </Link>
    </HStack>
  </VStack>
)

export default JoinCommunity
