import { useWeb3React } from "@web3-react/core"
import useContract from "hooks/useContract"
import usePersonalSign from "hooks/usePersonalSign"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import MERKLE_VESTING_ABI from "static/abis/MerkleVestingAbi.json"

type Data = {
  input: Record<string, string>
}

const useCreateCohort = () => {
  const { active } = useWeb3React()
  const toast = useToast()
  const sign = usePersonalSign()

  const vestingContract = useContract(
    active ? process.env.NEXT_PUBLIC_MERKLE_VESTING_CONTRACT_ADDRESS : null,
    MERKLE_VESTING_ABI,
    true
  )

  const createCohort = async (data_: Data) =>
    sign({ ...data_.input })
      .then((signature) =>
        fetch(`${process.env.NEXT_PUBLIC_API}/save-list`, {
          method: "POST",
          body: JSON.stringify({
            ...data_,
            signature,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json())
      )
      .then((data) => {
        // addCohort(merkleRoot, distributionDuration in seconds, vestingPeriod in seconds, cliffPeriod in seconds) - e.g: 172800 (2days), 43200 (12h)
        const addCohort = vestingContract?.addCohort(
          data?.merkleRoot,
          172800,
          43200,
          43200
        )
        return addCohort?.wait()
      })

  return useSubmit<Data, any>(createCohort, {
    onError: (e) => {
      console.log(e)
      toast({
        title: "Error creating cohort",
        description: e?.message,
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

export default useCreateCohort
