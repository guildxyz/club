import { useWeb3React } from "@web3-react/core"
import useContract from "hooks/useContract"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useMemo } from "react"
import STAKING_REWARDS_ABI from "static/abis/StakingRewardsAbi.json"
import addresses from "temporaryData/addresses"
import dev from "temporaryData/dev"

const useEndIncentive = () => {
  const { active, account } = useWeb3React()

  const stakerContract = useContract(
    active ? addresses.STAKER_ADDRESS : null,
    STAKING_REWARDS_ABI,
    true
  )

  const incentiveKey = useMemo(
    () => ({ ...dev.TEMP_INCENTIVEKEY, refundee: account }),
    [account]
  )

  const toast = useToast()

  const createIncentive = async () => {
    // DEV: ending an incentive
    return stakerContract.endIncentive(incentiveKey)
  }

  return useSubmit<null, any>(createIncentive, {
    onError: (e) => {
      console.log(e)
      toast({
        title: "Error ending incentive",
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

export default useEndIncentive
