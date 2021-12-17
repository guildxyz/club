import { Contract } from "@ethersproject/contracts"
import { Logger } from "@ethersproject/logger"
import { useWeb3React } from "@web3-react/core"
import useContract from "hooks/useContract"
import MERKLE_VESTING_ABI from "static/abis/MerkleVestingAbi.json"
import useSWR from "swr"

const getMerkleVestingData =
  (contract: Contract) => (): Promise<[string, string, string]> =>
    Promise.all([
      contract.lastEndingCohort(),
      contract.token(),
      contract.owner(),
    ]).catch((error) => {
      console.log('Error in "useMerkleVesting" hook:', error)
      /**
       * This means, that the error occured because the user is on a wrong chain, if
       * we were revalidating on this error, it would occur again until the the user
       * doesn't switch to the correct chain
       */
      if (error.code === Logger.errors.CALL_EXCEPTION) return [null, null, null]
      throw error
    })

const useMerkleVesting = () => {
  const { active, account, chainId } = useWeb3React()

  const contract = useContract(
    active ? process.env.NEXT_PUBLIC_MERKLE_VESTING_CONTRACT_ADDRESS : null,
    MERKLE_VESTING_ABI
  )

  const swrResponse = useSWR<[string, string, string]>(
    active ? ["merkleVesting", chainId, account] : null,
    getMerkleVestingData(contract),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  )

  // // Mutating SWR on "Claimed" event in order to update the disabled state of the "Claim" button
  // const handleClaim = () => mutate(["merkleVesting", chainId, account])

  // useEffect(() => {
  //   if (!contract) return

  //   contract.on("Claimed", handleClaim)

  //   return () => {
  //     contract.removeListener("Claimed", handleClaim)
  //   }
  // }, [contract])

  return {
    ...swrResponse,
    data: swrResponse.data ?? [undefined, undefined, undefined],
  }
}

export default useMerkleVesting
