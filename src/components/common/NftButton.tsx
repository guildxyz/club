import { Button, ButtonProps, Link, Spinner, Text, VStack } from "@chakra-ui/react"
import useTokenData from "hooks/useTokenData"
import { NFT } from "temporaryData/types"

type Props = {
  title?: string
  infoText?: string
  infoLink?: string
  nft?: NFT
  active?: boolean
} & ButtonProps

const NftButton = ({
  title,
  infoText,
  infoLink,
  nft,
  active,
  onClick,
}: Props): JSX.Element => {
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
      isFullWidth
      size="xl"
      variant="outline"
      colorScheme="whiteAlpha"
      color="seedclub.white"
      justifyContent="start"
      boxSizing="border-box"
      borderColor={active ? "seedclub.lightlime" : "seedclub.white"}
      borderWidth={1}
      height="auto"
      bgColor="seedclub.green.900"
      bgImage="url('/img/dark-green-bg.jpg')"
      overflow="hidden"
      position="relative"
      opacity={active ? 0.9 : 1}
      _before={{
        content: '""',
        position: "absolute",
        inset: 0,
        bgColor: "seedclub.green.900",
        bgImage: "url('/img/dark-green-bg.jpg')",
        opacity: 0.95,
      }}
      onClick={onClick}
      _active={{
        borderColor: "seedclub.lightlime",
        color: "seedclub.lightlime",
      }}
    >
      <VStack position="relative" py={4} width="full" spacing={2} alignItems="start">
        <Text as="span" fontSize="3xl">
          {title || nft?.tokenId}
        </Text>
        {nft && (
          <>
            <Text as="span" fontSize="sm" fontFamily="body">
              {`Fee: ${nft?.fee / 10000}%`}
            </Text>
            <Text as="span" fontSize="sm" fontFamily="body">
              {`Liquidity: ${nft?.liquidity}`}
            </Text>
          </>
        )}

        {infoText && (
          <>
            {infoLink ? (
              <Link href={infoLink}>
                <Text as="span" fontSize="medium" fontFamily="body">
                  {infoText}
                </Text>
              </Link>
            ) : (
              <Text as="span" fontSize="medium" fontFamily="body">
                {infoText}
              </Text>
            )}
          </>
        )}

        {nft && (
          <Text
            position="absolute"
            top={3}
            right={0}
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
        )}
      </VStack>
    </Button>
  )
}

export default NftButton
