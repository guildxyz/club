import { useWeb3React } from "@web3-react/core"
import useContract from "hooks/useContract"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useMemo } from "react"
import STAKING_REWARDS_ABI from "static/abis/StakingRewardsAbi.json"
import addresses from "temporaryData/addresses"
import dev from "temporaryData/dev"

const useClaimAndUnstake = (tokenId: number) => {
  const { active, account, chainId } = useWeb3React()

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

  // Temp. solution, should use 2 useSubmit hooks for this
  const stakeNft = async () => {
    // Unstake NFT
    const unstakeRes = await stakerContract.unstakeToken(incentiveKey, tokenId)
    await unstakeRes.wait()
    // Withdraw NFT
    const withdrawNftRes = await stakerContract.withdrawToken(
      tokenId,
      account,
      "0x00"
    )
    await withdrawNftRes.wait()
    // Claim rewards
    const claimRewardRes = await stakerContract.claimReward(
      addresses.REWARD_TOKEN_ADDRESS,
      account,
      0
    )
    return claimRewardRes?.wait()
  }

  return useSubmit<null, any>(stakeNft, {
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
        title: "Successfully submitted transaction!",
        description:
          "It might take some time to finalize the transaction. Please check your wallet for more details.",
        duration: 4000,
        status: "success",
      })
    },
  })
}

export default useClaimAndUnstake
