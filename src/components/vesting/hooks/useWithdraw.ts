import { useWeb3React } from "@web3-react/core"
import useContract from "hooks/useContract"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import MERKLE_VESTING_ABI from "static/abis/MerkleVestingAbi.json"
import parseError from "utils/parseError"

const useWithdraw = () => {
  const { active, account } = useWeb3React()

  const contract = useContract(
    active ? process.env.NEXT_PUBLIC_MERKLE_VESTING_CONTRACT_ADDRESS : null,
    MERKLE_VESTING_ABI,
    true
  )

  const toast = useToast()

  const withdraw = async () => {
    const withdrawRes = await contract?.withdraw(account)
    return withdrawRes?.wait()
  }

  return useSubmit<null, any>(withdraw, {
    onError: (e) => {
      console.error(e)
      toast({
        title: "Error withdrawing tokens",
        description: parseError(e),
        status: "error",
      })
    },
    onSuccess: () => {
      toast({
        title: "Successfull withdraw!",
        duration: 4000,
        status: "success",
      })
    },
  })
}

export default useWithdraw
