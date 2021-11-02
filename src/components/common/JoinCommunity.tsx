import {
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react"
import { DiscordLogo, TwitterLogo } from "phosphor-react"

const JoinCommunity = () => (
  <VStack w="full" spacing={2}>
    <Flex px={4} py={1} width="full" alignItems="center" justifyContent="center">
      <Divider width="full" borderColor={"blackAlpha.400"} />
      <Flex
        px={4}
        alignItems="center"
        justifyContent="center"
        fontSize="sm"
        fontWeight="bold"
        color={"blackAlpha.500"}
      >
        <Text as="span" width="max-content" fontSize="md">
          Join our community
        </Text>
      </Flex>
      <Divider width="full" borderColor={"blackAlpha.400"} />
    </Flex>

    <HStack spacing={2}>
      <Link href="https://twitter.com/seedclubhq" target="_blank" rel="noreferrer">
        <IconButton
          colorScheme="twitter"
          icon={<Icon as={TwitterLogo} />}
          aria-label="Twitter"
          rounded="full"
          boxSize={8}
          minW={8}
          minH={8}
        />
      </Link>

      <Link href="https://discord.gg/42UjJskuEF" target="_blank" rel="noreferrer">
        <IconButton
          colorScheme="DISCORD"
          icon={<Icon as={DiscordLogo} />}
          aria-label="Discord"
          rounded="full"
          boxSize={8}
          minW={8}
          minH={8}
        />
      </Link>
    </HStack>
  </VStack>
)

export default JoinCommunity
