type User = {
  address: string
}

type Data = {
  id: number
}

type CoingeckoToken = {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

export type { User, Data, CoingeckoToken }
