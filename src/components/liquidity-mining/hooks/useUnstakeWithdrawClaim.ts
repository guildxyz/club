import { useWeb3React } from "@web3-react/core"
import incentiveKey from "data/incentiveKey"
import useContract from "hooks/useContract"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import STAKING_REWARDS_ABI from "static/abis/StakingRewardsAbi.json"
import parseError from "utils/parseError"

const useUnstakeWithdrawClaim = (
  tokenIds: Array<number>,
  mode: "claim" | "unstakeWithdrawClaim" = "unstakeWithdrawClaim"
) => {
  const { active, account } = useWeb3React()

  const stakerContract = useContract(
    active ? process.env.NEXT_PUBLIC_STAKING_REWARDS_CONTRACT_ADDRESS : null,
    STAKING_REWARDS_ABI,
    true
  )

  const toast = useToast()

  // Unstake, withdraw, and claim in one call
  const unstakeWithdrawClaim = async () => {
    if (mode === "claim") {
      const claimRes = await stakerContract.claimReward(
        process.env.NEXT_PUBLIC_REWARD_TOKEN_ADDRESS,
        account,
        0
      )
      return claimRes?.wait()
    }

    const unstakeWithdrawTokens = tokenIds
      .map((tokenId) => [
        stakerContract.interface.encodeFunctionData("unstakeToken", [
          incentiveKey,
          tokenId,
        ]),
        stakerContract.interface.encodeFunctionData("withdrawToken", [
          tokenId,
          account,
          "0x00",
        ]),
      ])
      ?.reduce((arr1, arr2) => arr1.concat(arr2))

    const multicallAll = await stakerContract.multicall([
      ...unstakeWithdrawTokens,
      // We only need to claim rewards once at the end
      stakerContract.interface.encodeFunctionData("claimReward", [
        process.env.NEXT_PUBLIC_REWARD_TOKEN_ADDRESS,
        account,
        0,
      ]),
    ])

    return multicallAll?.wait().then((res) => {
      if (res.status === 0) throw new Error("An unknown error occurred.")
      return res
    })
  }

  return useSubmit<null, any>(unstakeWithdrawClaim, {
    onError: (e) => {
      toast({
        title: `Error ${mode === "claim" ? "claiming" : "unstaking"} NFT`,
        description: parseError(e),
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
