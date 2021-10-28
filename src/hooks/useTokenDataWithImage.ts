import { useMemo } from "react"
import useTokenData from "./useTokenData"
import useTokens from "./useTokens"

const useTokenDataWithImage = (
  address: string
): { tokenSymbol: string; tokenImage: string; isLoading: boolean } => {
  const { tokens, isLoading } = useTokens()
  const {
    isValidating: isFallbackDataLoading,
    data: [, fallbackTokenSymbol],
  } = useTokenData(address)

  const tokenData = useMemo(
    () =>
      tokens?.length ? tokens.find((token) => token.address === address) : null,
    [address, tokens]
  )

  return {
    tokenSymbol: tokenData?.symbol || fallbackTokenSymbol,
    tokenImage: tokenData?.logoURI?.replace("thumb", "small"),
    isLoading: isLoading || isFallbackDataLoading,
  }
}

export default useTokenDataWithImage
