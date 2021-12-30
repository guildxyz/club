import { InjectedConnector } from "@web3-react/injected-connector"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"

enum Chains {
  ETHEREUM = 1,
  GOERLI = 5,
}

const RPC = {
  ETHEREUM: {
    chainName: "Ethereum",
    blockExplorerUrls: ["https://etherscan.io/"],
    iconUrls: ["/networkLogos/ethereum.svg"],
    rpcUrls: [
      "https://eth-mainnet.alchemyapi.io/v2/yiNnGigifqu96_5ys970MfkDBl2z2Or9",
    ],
  },
  GOERLI: {
    chainName: "Goerli",
    blockExplorerUrls: ["https://goerli.etherscan.io/"],
    iconUrls: ["/networkLogos/ethereum.svg"],
    rpcUrls: ["https://goerli-light.eth.linkpool.io/"],
  },
}

const supportedChains = [, /* "GOERLI", */ "ETHEREUM"]
const supportedChainIds = supportedChains.map((_) => Chains[_])

const injected = new InjectedConnector({ supportedChainIds })

const walletConnect = new WalletConnectConnector({
  supportedChainIds,
  rpc: Object.keys(RPC).reduce(
    (obj, chainName) => ({
      ...obj,
      [Chains[chainName]]: RPC[chainName].rpcUrls[0],
    }),
    {}
  ),
  qrcode: true,
})

export { Chains, RPC, supportedChains, injected, walletConnect }
