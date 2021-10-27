import { useWeb3React } from "@web3-react/core"
import MerkleDistributor from "constants/MerkleDistributor"
import useContract from "hooks/useContract"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useMemo } from "react"
import MERKLE_ABI from "static/abis/MerkleDistributorAbi.json"

const useClaim = () => {
  const { active, account } = useWeb3React()
  const merkleDistributorData = useMemo(
    () => MerkleDistributor.claims[account],
    [account]
  )

  const contract = useContract(
    active ? process.env.NEXT_PUBLIC_CONTRACT_ADDRESS : null,
    MERKLE_ABI,
    true
  )

  const toast = useToast()

  const claim = () =>
    contract?.claim(
      merkleDistributorData?.index,
      account,
      merkleDistributorData?.amount,
      merkleDistributorData?.proof
    )

  return useSubmit<null, any>(claim, {
    onError: () => {
      toast({
        title: "Error claiming tokens",
        status: "error",
      })
    },
    onSuccess: () => {
      toast({
        title: "Successfully submitted transaction!",
        description:
          "It might take some time to finalize the transaction. Please check your wallet for more details.",
        duration: 4000,
        status: "success",
      })
    },
  })
}

export default useClaim
