import { Logger } from "@ethersproject/logger"
import { useWeb3React } from "@web3-react/core"
import useContract from "hooks/useContract"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import STAKING_REWARDS_ABI from "static/abis/StakingRewardsAbi.json"
import incentiveKey from "temporaryData/incentiveKey"

const useUnstakeWithdrawClaim = (tokenId: number) => {
  const { active, account } = useWeb3React()

  const stakerContract = useContract(
    active ? process.env.NEXT_PUBLIC_STAKING_REWARDS_CONTRACT_ADDRESS : null,
    STAKING_REWARDS_ABI,
    true
  )

  const toast = useToast()

  // Unstake, withdraw, and claim in one call
  const unstakeWithdrawClaim = async () => {
    const multicall = await stakerContract.multicall([
      stakerContract.interface.encodeFunctionData("unstakeToken", [
        incentiveKey,
        tokenId,
      ]),
      stakerContract.interface.encodeFunctionData("withdrawToken", [
        tokenId,
        account,
        "0x00",
      ]),
      stakerContract.interface.encodeFunctionData("claimReward", [
        process.env.NEXT_PUBLIC_REWARD_TOKEN_ADDRESS,
        account,
        0,
      ]),
    ])

    return multicall?.wait()
  }

  return useSubmit<null, any>(unstakeWithdrawClaim, {
    onError: (e) => {
      console.error(e)
      toast({
        title: "Error unstaking NFT",
        description: !Object.values(Logger.errors).includes(e.code) && e?.message,
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
