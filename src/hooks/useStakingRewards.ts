import { Contract } from "@ethersproject/contracts"
import { Logger } from "@ethersproject/logger"
import { useWeb3React } from "@web3-react/core"
import useContract from "hooks/useContract"
import STAKING_REWARDS_ABI from "static/abis/StakingRewardsAbi.json"
import useSWR from "swr"

const getStakingRewardsData =
  (contract: Contract) =>
  (_: string): Promise<any> =>
    Promise.all([
      contract.liquidityToken0(),
      contract.liquidityToken1(),
      contract.rewardsToken(),
    ]).catch((error) => {
      /**
       * This means, that the error occured because the user is on a wrong chain, if
       * we were revalidating on this error, it would occur again until the the user
       * doesn't switch to the correct chain
       */
      if (error.code === Logger.errors.CALL_EXCEPTION) return [null, null, null]
      throw error
    })

const useStakingRewards = () => {
  const { active, account, chainId } = useWeb3React()

  const contract = useContract(
    active ? process.env.NEXT_PUBLIC_STAKING_REWARDS_CONTRACT_ADDRESS : null,
    STAKING_REWARDS_ABI
  )

  const swrResponse = useSWR<[string]>(
    active ? ["merkle", chainId, account] : null,
    getStakingRewardsData(contract),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryInterval: 100,
    }
  )

  return {
    ...swrResponse,
    /**
     * Doing this instead of using initialData to make sure it fetches when
     * shouldFetch becomes true
     */
    data: swrResponse.data ?? [undefined, undefined, undefined],
  }
}

export default useStakingRewards
