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

  const createCohort = async (data_: Data) => {
    const signature = await sign({ ...data_.input })
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/save-list`, {
      method: "POST",
      body: JSON.stringify({
        ...data_,
        signature,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res?.json()
    // root, distributionDuration, vestingPeriod , cliffPeriod - in seconds
    const addCohort = await vestingContract?.addCohort(
      data?.merkleRoot,
      60 * 60 * 3, // 3 hours distribution
      60 * 60 * 2.5, // 2.5h vesting period
      60 * 60 * 0.5 // 30mins cliff
    )

    return addCohort?.wait()
  }

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
