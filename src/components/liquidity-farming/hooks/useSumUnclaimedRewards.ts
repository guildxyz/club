import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import useContract from "hooks/useContract"
import { useEffect, useState } from "react"
import STAKING_REWARDS_ABI from "static/abis/StakingRewardsAbi.json"
import incentiveKey from "temporaryData/incentiveKey"

const useSumUnclaimedRewards = (tokenIdArray: Array<number>): string => {
  const [unclaimedRewards, setUnclaimedRewards] = useState("0.0000")
  const { active } = useWeb3React()

  const stakerContract = useContract(
    active ? process.env.NEXT_PUBLIC_STAKING_REWARDS_CONTRACT_ADDRESS : null,
    STAKING_REWARDS_ABI,
    true
  )

  const countNewLiquidity = async () => {
    if (!tokenIdArray || tokenIdArray.length === 0) {
      setUnclaimedRewards("0.0000")
      return
    }

    let newUnclaimedRewardsSum = 0

    for (let i = 0; i < tokenIdArray.length; i++) {
      if (tokenIdArray[i] !== null) {
        const rewardsInfo = await stakerContract
          .getRewardInfo(incentiveKey, +tokenIdArray?.[i])
          .catch((_) => 0)
        const reward = parseFloat(formatUnits(rewardsInfo?.reward || 0))
        newUnclaimedRewardsSum += reward
      }
    }

    setUnclaimedRewards(newUnclaimedRewardsSum.toFixed(4))
  }

  useEffect(() => {
    countNewLiquidity()
  }, [tokenIdArray])

  return unclaimedRewards
}

export default useSumUnclaimedRewards
