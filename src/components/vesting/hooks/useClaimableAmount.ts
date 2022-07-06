import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import useContract from "hooks/useContract"
import MERKLE_VESTING_ABI from "static/abis/MerkleVestingAbi.json"
import useSWR from "swr"

const getClaimableAmount =
  (
    contract: Contract,
    cohortId: string,
    index: number,
    account: string,
    fullAmount: string
  ) =>
  (): Promise<BigNumber> =>
    contract.getClaimableAmount(
      cohortId,
      index,
      account,
      parseInt(formatUnits(fullAmount))
    )

const useClaimableAmount = (cohortId: string, index: number, fullAmount: string) => {
  const { active, account, chainId } = useWeb3React()
  const contract = useContract(
    active ? process.env.NEXT_PUBLIC_MERKLE_VESTING_CONTRACT_ADDRESS : null,
    MERKLE_VESTING_ABI
  )

  return useSWR<BigNumber>(
    active &&
      typeof cohortId !== "undefined" &&
      typeof index !== "undefined" &&
      fullAmount
      ? ["claimableAmount", chainId, index, account, cohortId, fullAmount]
      : null,
    getClaimableAmount(contract, cohortId, index, account, fullAmount),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  )
}

export default useClaimableAmount
