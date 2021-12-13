import { HStack, Img, Link, VStack } from "@chakra-ui/react"

type Props = {
  fixed?: boolean
}

const JoinCommunity = ({ fixed }: Props): JSX.Element => (
  <VStack
    position={fixed ? "relative" : { base: "relative", lg: "fixed" }}
    right={fixed ? 0 : { base: 0, lg: 10 }}
    bottom={fixed ? 0 : { base: 0, lg: 8 }}
    mt={8}
    spacing={2}
  >
    <HStack spacing={2}>
      <Link href="https://twitter.com/seedclubhq" target="_blank" rel="noreferrer">
        <Img src="/img/twitter.png" height={8} />
      </Link>

      <Link href="https://discord.gg/42UjJskuEF" target="_blank" rel="noreferrer">
        <Img src="/img/discord.png" height={8} />
      </Link>

      <Link href="#" target="_blank" rel="noreferrer">
        <Img
          mx={1}
          position="relative"
          top={-0.5}
          src="/img/mirror.png"
          height={8}
        />
      </Link>
    </HStack>
  </VStack>
)

export default JoinCommunity
