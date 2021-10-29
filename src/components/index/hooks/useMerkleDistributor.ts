import { Contract } from "@ethersproject/contracts"
import { Logger } from "@ethersproject/logger"
import { useWeb3React } from "@web3-react/core"
import MerkleDistributor from "constants/MerkleDistributor"
import useContract from "hooks/useContract"
import { useEffect } from "react"
import MERKLE_ABI from "static/abis/MerkleDistributorAbi.json"
import useSWR, { mutate } from "swr"

const getMerkleData =
  (contract: Contract, index: string) =>
  (_: string): Promise<[boolean, string, any, string]> =>
    Promise.all([
      contract.isClaimed(index),
      contract.token(),
      contract.distributionEnd(),
      contract.owner(),
    ]).catch((error) => {
      console.log('Erro in "useMerkleDistributor" hook:', error)
      /**
       * This means, that the error occured because the user is on a wrong chain, if
       * we were revalidating on this error, it would occur again until the the user
       * doesn't switch to the correct chain
       */
      if (error.code === Logger.errors.CALL_EXCEPTION)
        return [null, null, null, null]
      throw error
    })

const useMerkleDistributor = (userAddress: string) => {
  const { active, account, chainId } = useWeb3React()

  const index = MerkleDistributor.claims[userAddress]?.index

  const contract = useContract(
    active ? process.env.NEXT_PUBLIC_MERKLE_DISTRIBUTOR_CONTRACT_ADDRESS : null,
    MERKLE_ABI
  )

  const swrResponse = useSWR<[boolean, string, any, string]>(
    active ? ["merkle", chainId, account] : null,
    getMerkleData(contract, index),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryInterval: 100,
    }
  )

  // Mutating SWR on "Claimed" event in order to update the disabled state of the "Claim" button on the Airdrop page
  const handleClaim = () => mutate(["merkle", chainId, account])

  useEffect(() => {
    if (!contract) return

    contract.on("Claimed", handleClaim)

    return () => {
      contract.removeListener("Claimed", handleClaim)
    }
  }, [contract])

  return {
    ...swrResponse,
    /**
     * Doing this instead of using initialData to make sure it fetches when
     * shouldFetch becomes true
     */
    data: swrResponse.data ?? [undefined, undefined, undefined, undefined],
  }
}

export default useMerkleDistributor
