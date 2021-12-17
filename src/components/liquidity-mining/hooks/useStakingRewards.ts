import { BigNumber } from "@ethersproject/bignumber"
import { hexZeroPad } from "@ethersproject/bytes"
import { Contract } from "@ethersproject/contracts"
import { Logger } from "@ethersproject/logger"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import staticIncentiveKey from "data/incentiveKey"
import { NFT } from "data/types"
import useContract from "hooks/useContract"
import NFPOSITIONMANAGER_ABI from "static/abis/NfPositionManagerAbi.json"
import STAKING_REWARDS_ABI from "static/abis/StakingRewardsAbi.json"
import useSWR from "swr"
import unique from "utils/uniqueFilter"

const getStakingRewardsData =
  (
    walletAddress: string,
    incentiveKey: any,
    stakerContract: Contract,
    nftContract: Contract
  ) =>
  (
    _: string
  ): Promise<[Array<Record<string, any>>, Array<NFT>, string, BigNumber]> => {
    const depositTransferredEvents: Promise<Array<NFT>> = new Promise(
      async (resolve, _) => {
        const nftTransfers = await nftContract?.queryFilter(
          nftContract.filters.Transfer(walletAddress)
        )

        const uniqueNftTransfers = nftTransfers
          ?.map((transfer) => parseInt(transfer?.args?.tokenId))
          ?.filter(unique)

        const depoArray = []

        for (let i = 0; i < uniqueNftTransfers?.length; i++) {
          const depo = await stakerContract.queryFilter(
            stakerContract.filters.DepositTransferred([
              uniqueNftTransfers[i],
              hexZeroPad("0x00", 32),
              hexZeroPad(walletAddress, 32),
            ])
          )

          if (depo?.length) {
            const tokenId = parseInt(depo?.[0]?.args?.tokenId)

            if (tokenId) {
              const positions = await nftContract.positions(tokenId)
              const { token0, token1, fee, liquidity } = positions

              depoArray.push({
                tokenId,
                fee,
                token0,
                token1,
                liquidity: parseFloat(formatUnits(liquidity)).toFixed(2),
                canStake:
                  token0.toLowerCase() ===
                    process.env.NEXT_PUBLIC_TOKEN0_ADDRESS.toLowerCase() &&
                  token1.toLowerCase() ===
                    process.env.NEXT_PUBLIC_TOKEN1_ADDRESS.toLowerCase(),
              })
            }
          }
        }

        resolve(depoArray)
      }
    )

    return Promise.all([
      stakerContract.queryFilter(
        stakerContract.filters.IncentiveCreated([
          incentiveKey.rewardToken,
          incentiveKey.pool,
        ])
      ),
      depositTransferredEvents,
      nftContract.name(),
      stakerContract.rewards(
        process.env.NEXT_PUBLIC_REWARD_TOKEN_ADDRESS,
        walletAddress
      ),
    ]).catch((error) => {
      console.log('Error in "useStakingRewards" hook:', error)
      /**
       * This means, that the error occured because the user is on a wrong chain, if
       * we were revalidating on this error, it would occur again until the the user
       * doesn't switch to the correct chain
       */
      if (error.code === Logger.errors.CALL_EXCEPTION)
        return [null, null, null, null]
      throw error
    })
  }

const useStakingRewards = () => {
  const { active, account, chainId } = useWeb3React()

  const nftContract = useContract(
    active ? process.env.NEXT_PUBLIC_NFPOSITIOMANAGER_ADDRESS : null,
    NFPOSITIONMANAGER_ABI,
    true
  )

  const stakerContract = useContract(
    active ? process.env.NEXT_PUBLIC_STAKING_REWARDS_CONTRACT_ADDRESS : null,
    STAKING_REWARDS_ABI,
    true
  )

  const swrResponse = useSWR<
    [Array<Record<string, any>>, Array<NFT>, string, BigNumber]
  >(
    active ? ["stakingRewards", chainId, account] : null,
    getStakingRewardsData(account, staticIncentiveKey, stakerContract, nftContract),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  )

  return {
    ...swrResponse,
    /**
     * Doing this instead of using initialData to make sure it fetches when
     * shouldFetch becomes true
     */
    data: swrResponse.data ?? [undefined, undefined, undefined, undefined],
  }
}

export default useStakingRewards
