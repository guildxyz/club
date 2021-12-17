import { BigNumber } from "@ethersproject/bignumber"
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
  (_: string): Promise<[boolean, string, BigNumber, string]> =>
    Promise.all([
      typeof index === "number" ? contract.isClaimed(index) : false,
      contract.token(),
      contract.distributionEnd(),
      contract.owner(),
    ]).catch((error) => {
      console.log('Error in "useMerkleDistributor" hook:', error)
      /**
       * This means, that the error occured because the user is on a wrong chain, if
       * we were revalidating on this error, it would occur again until the the user
       * doesn't switch to the correct chain
       */
      if (error.code === Logger.errors.CALL_EXCEPTION)
        return [null, null, null, null]
      throw error
    })

const useMerkleDistributor = () => {
  const { active, account, chainId } = useWeb3React()

  const contract = useContract(
    active ? process.env.NEXT_PUBLIC_MERKLE_DISTRIBUTOR_CONTRACT_ADDRESS : null,
    MERKLE_ABI
  )

  const swrResponse = useSWR<[boolean, string, BigNumber, string]>(
    active ? ["merkle", chainId, account] : null,
    getMerkleData(contract, MerkleDistributor.claims[account]?.index),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
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
    data: swrResponse.data ?? [undefined, undefined, undefined, undefined],
  }
}

export default useMerkleDistributor
