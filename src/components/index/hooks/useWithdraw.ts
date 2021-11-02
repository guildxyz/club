import { useWeb3React } from "@web3-react/core"
import useContract from "hooks/useContract"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import MERKLE_ABI from "static/abis/MerkleDistributorAbi.json"

const useWithdraw = () => {
  const { active, account } = useWeb3React()

  const contract = useContract(
    active ? process.env.NEXT_PUBLIC_MERKLE_DISTRIBUTOR_CONTRACT_ADDRESS : null,
    MERKLE_ABI,
    true
  )

  const toast = useToast()

  const withdraw = async () => {
    const withdrawRes = await contract?.withdraw(account)
    return withdrawRes?.wait()
  }

  return useSubmit<null, any>(withdraw, {
    onError: () => {
      toast({
        title: "Error withdrawing tokens",
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
