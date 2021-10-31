import { defaultAbiCoder } from "@ethersproject/abi"
import { useWeb3React } from "@web3-react/core"
import useContract from "hooks/useContract"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useMemo } from "react"
import NFPOSITIONMANAGER_ABI from "static/abis/NfPositionManagerAbi.json"
import addresses from "temporaryData/addresses"
import dev from "temporaryData/dev"

const useStakeNft = (tokenId: number) => {
  const { active, account, chainId } = useWeb3React()

  const nftContract = useContract(
    active ? addresses.NFPOSITIOMANAGER_ADDRESS : null,
    NFPOSITIONMANAGER_ABI,
    true
  )

  const incentiveKey = useMemo(
    () => ({ ...dev.TEMP_INCENTIVEKEY, refundee: account }),
    [account]
  )

  const toast = useToast()

  // Temp. solution, should use 2 useSubmit hooks for this
  const stakeNft = async () => {
    // Deposit & stake in one call
    const depositAndStakeRes = await nftContract[
      "safeTransferFrom(address,address,uint256,bytes)"
    ](
      account,
      addresses.STAKER_ADDRESS,
      tokenId,
      defaultAbiCoder.encode(
        ["address", "address", "uint", "uint", "address"],
        [
          incentiveKey.rewardToken,
          incentiveKey.pool,
          incentiveKey.startTime,
          incentiveKey.endTime,
          incentiveKey.refundee,
        ]
      )
    )
    return depositAndStakeRes?.wait()
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

export default useStakeNft
