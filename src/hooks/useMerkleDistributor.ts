import { Contract } from "@ethersproject/contracts"
import { Logger } from "@ethersproject/logger"
import { useWeb3React } from "@web3-react/core"
import MerkleDistributor from "constants/MerkleDistributor"
import useContract from "hooks/useContract"
import MERKLE_ABI from "static/abis/MerkleDistributorAbi.json"
import useSWR from "swr"

const getMerkleData =
  (contract: Contract, index: string) =>
  (_: string): Promise<any> =>
    Promise.all([contract.isClaimed(index), contract.token()]).catch((error) => {
      /**
       * This means, that the error occured because the user is on a wrong chain, if
       * we were revalidating on this error, it would occur again until the the user
       * doesn't switch to the correct chain
       */
      if (error.code === Logger.errors.CALL_EXCEPTION) return [null, null]
      throw error
    })

const useMerkleDistributor = (userAddress: string) => {
  const { active, account, chainId } = useWeb3React()

  const index = MerkleDistributor.claims[userAddress]?.index

  const contract = useContract(
    active ? process.env.NEXT_PUBLIC_CONTRACT_ADDRESS : null,
    MERKLE_ABI
  )

  const swrResponse = useSWR<[string]>(
    active ? ["merkle", chainId, account] : null,
    getMerkleData(contract, index),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryInterval: 100,
    }
  )

  return {
    ...swrResponse,
    /**
     * Doing this instead of using initialData to make sure it fetches when
     * shouldFetch becomes true
     */
    data: swrResponse.data ?? [undefined, undefined],
  }
}

export default useMerkleDistributor
