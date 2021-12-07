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
      borderColor={active ? "seedclub.lightgreen" : "gray.300"}
      borderWidth={1}
      height="auto"
      onClick={onClick}
      _active={{
        borderColor: "seedclub.lightlime",
        color: "gray.700",
      }}
    >
      <VStack py={4} spacing={2} alignItems="start">
        <Text as="span" fontSize="4xl">
          {nft?.tokenId}
        </Text>
        <Text as="span" fontSize="sm" fontFamily="body">
          <Text as="span" fontWeight="extrabold">
            Fee:{" "}
          </Text>
          {`${nft?.fee / 10000}%`}
        </Text>
        <Text as="span" fontSize="sm" fontFamily="body">
          <Text as="span" fontWeight="extrabold">
            Liquidity:{" "}
          </Text>
          {nft?.liquidity}
        </Text>

        <Text
          position="absolute"
          top={3}
          right={8}
          as="span"
          fontSize="sm"
          fontFamily="body"
        >
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
