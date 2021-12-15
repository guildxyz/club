import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"

const usePersonalSign = () => {
  const { library, account } = useWeb3React<Web3Provider>()

  return async (message: any): Promise<any> =>
    library.send("personal_sign", [JSON.stringify(message), account.toLowerCase()])
}

export default usePersonalSign
