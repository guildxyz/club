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

type NFT = {
  tokenId: number
  fee: number
  token0: string
  token1: string
  liquidity: number
  canStake: boolean
}

export type { User, Data, CoingeckoToken, NFT }
