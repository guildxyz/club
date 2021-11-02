import { Contract } from "@ethersproject/contracts"
import { Logger } from "@ethersproject/logger"
import { useWeb3React } from "@web3-react/core"
import useContract from "hooks/useContract"
import REWARD_TOKEN_ABI from "static/abis/RewardTokenAbi.json"
import useSWR from "swr"

const getBalanceOf = (contract: Contract, merkleContractAddress: string) =>
  contract?.balanceOf(merkleContractAddress).catch((error) => {
    console.log('Error in "useWithdrawAmount" hook:', error)
    /**
     * This means, that the error occured because the user is on a wrong chain, if we
     * were revalidating on this error, it would occur again until the the user
     * doesn't switch to the correct chain
     */
    if (error.code === Logger.errors.CALL_EXCEPTION) return null
    throw error
  })

const useWithdrawAmount = () => {
  const { account, active, chainId } = useWeb3React()
  const rewardTokenContract = useContract(
    process.env.NEXT_PUBLIC_REWARD_TOKEN_ADDRESS,
    REWARD_TOKEN_ABI
  )

  const swrResponse = useSWR<any>(
    active ? ["withdrawAmount", chainId, account] : null,
    getBalanceOf(
      rewardTokenContract,
      process.env.NEXT_PUBLIC_MERKLE_DISTRIBUTOR_CONTRACT_ADDRESS
    ),
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
    data: swrResponse.data ?? undefined,
  }
}

export default useWithdrawAmount
