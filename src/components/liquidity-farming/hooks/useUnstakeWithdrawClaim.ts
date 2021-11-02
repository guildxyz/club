import { useWeb3React } from "@web3-react/core"
import useContract from "hooks/useContract"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import STAKING_REWARDS_ABI from "static/abis/StakingRewardsAbi.json"
import addresses from "temporaryData/addresses"
import dev from "temporaryData/dev"

const useUnstakeWithdrawClaim = (tokenId: number) => {
  const { active, account } = useWeb3React()

  const stakerContract = useContract(
    active ? addresses.STAKER_ADDRESS : null,
    STAKING_REWARDS_ABI,
    true
  )

  const toast = useToast()

  // Unstake, withdraw, and claim in one call
  const unstakeWithdrawClaim = async () => {
    const multicall = await stakerContract.multicall([
      stakerContract.interface.encodeFunctionData("unstakeToken", [
        dev.INCENTIVEKEY,
        tokenId,
      ]),
      stakerContract.interface.encodeFunctionData("withdrawToken", [
        tokenId,
        account,
        "0x00",
      ]),
      stakerContract.interface.encodeFunctionData("claimReward", [
        addresses.REWARD_TOKEN_ADDRESS,
        account,
        0,
      ]),
    ])

    return multicall?.wait()
  }

  return useSubmit<null, any>(unstakeWithdrawClaim, {
    onError: (e) => {
      console.log(e)
      toast({
        title: "Error staking NFT",
        description: e?.message,
        status: "error",
      })
    },
    onSuccess: () => {
      toast({
        title: "Successfully claimed rewards!",
        duration: 4000,
        status: "success",
      })
    },
  })
}

export default useUnstakeWithdrawClaim
