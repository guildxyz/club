import { Button, ButtonProps, Spinner, Text, VStack } from "@chakra-ui/react"
import useTokenData from "hooks/useTokenData"
import { NFT } from "temporaryData/types"

type Props = {
  nft: NFT
  active?: boolean
} & ButtonProps

const NftButton = ({ nft, active, onClick }: Props): JSX.Element => {
  const {
    isValidating: isToken0Loading,
    data: [, token0Symbol],
  } = useTokenData(nft?.token0)
  const {
    isValidating: isToken1Loading,
    data: [, token1Symbol],
  } = useTokenData(nft?.token1)

  return (
    <Button
      key={nft.tokenId}
      isFullWidth
      size="xl"
      variant="outline"
      justifyContent="start"
      boxSizing="border-box"
      borderColor={active ? "seedclub.green.700" : "gray.200"}
      borderWidth={3}
      height="auto"
      onClick={onClick}
    >
      <VStack py={4} spacing={2} alignItems="start">
        <Text as="span" fontFamily="display" fontSize="3xl">
          {nft?.tokenId}
        </Text>
        <Text as="span" fontSize="sm">
          <Text as="span" fontWeight="extrabold">
            Fee:{" "}
          </Text>
          {`${nft?.fee / 10000}%`}
        </Text>
        <Text as="span" fontSize="sm">
          <Text as="span" fontWeight="extrabold">
            Liquidity:{" "}
          </Text>
          {nft?.liquidity}
        </Text>

        <Text position="absolute" top={3} right={8} as="span" fontSize="sm">
          {isToken0Loading ? (
            <Spinner size="xs" />
          ) : (
            !isToken1Loading && `${token0Symbol} / ${token1Symbol}`
          )}
        </Text>
      </VStack>
    </Button>
  )
}

export default NftButton
