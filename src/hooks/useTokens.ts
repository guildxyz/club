import useSWRImmutable from "swr/immutable"
import { CoingeckoToken } from "temporaryData/types"

const fetchTokens = async () =>
  fetch("https://tokens.coingecko.com/uniswap/all.json")
    .then((rawData) => rawData.json())
    .then((data) => data.tokens)

const useTokens = (): { tokens: Array<CoingeckoToken>; isLoading: boolean } => {
  const { isValidating, data } = useSWRImmutable("tokens", fetchTokens)

  return { tokens: data, isLoading: isValidating }
}

export default useTokens
