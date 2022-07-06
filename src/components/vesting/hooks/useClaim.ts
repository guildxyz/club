import { useWeb3React } from "@web3-react/core"
import useContract from "hooks/useContract"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import MERKLE_VESTING_ABI from "static/abis/MerkleVestingAbi.json"
import parseError from "utils/parseError"
import useClaimData from "./useClaimData"
import useUsersLatestCohort from "./useUsersLatestCohort"

const useClaim = () => {
  const { active, account } = useWeb3React()
  const { data: usersLatestCohort } = useUsersLatestCohort()
  const { data: claimData } = useClaimData(usersLatestCohort)

  const contract = useContract(
    active ? process.env.NEXT_PUBLIC_MERKLE_VESTING_CONTRACT_ADDRESS : null,
    MERKLE_VESTING_ABI,
    true
  )

  const toast = useToast()

  const claim = async () => {
    const claimRes = await contract?.claim(
      usersLatestCohort,
      claimData?.index,
      account,
      claimData?.amount,
      claimData?.proof
    )
    return claimRes?.wait()
  }

  return useSubmit<null, any>(claim, {
    onError: (e) => {
      console.error(e)
      toast({
        title: "Error claiming tokens",
        description: parseError(e),
        status: "error",
      })
    },
    onSuccess: () => {
      toast({
        title: "Successfully claimed tokens!",
        duration: 4000,
        status: "success",
      })
    },
  })
}

export default useClaim
