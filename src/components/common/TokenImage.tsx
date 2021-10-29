import { Flex, Img, Spinner, Text } from "@chakra-ui/react"

type Props = {
  isLoading?: boolean
  tokenSymbol?: string
  tokenImage?: string
}

const TokenImage = ({ isLoading, tokenSymbol, tokenImage }: Props): JSX.Element => (
  <Flex
    boxSize={16}
    bgColor="gray.300"
    rounded="full"
    borderWidth={3}
    borderColor="seedclub.white"
    alignItems="center"
    justifyContent="center"
  >
    {isLoading && !tokenSymbol && <Spinner />}
    {tokenImage && tokenSymbol && (
      <Img boxSize={10} maxW={10} maxH={10} src={tokenImage} alt={tokenSymbol} />
    )}
    {!tokenImage && tokenSymbol && (
      <Text as="span" fontWeight="bold" fontFamily="body" fontSize="md">
        {tokenSymbol}
      </Text>
    )}
  </Flex>
)

export default TokenImage
