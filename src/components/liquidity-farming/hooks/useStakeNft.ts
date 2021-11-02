import { defaultAbiCoder } from "@ethersproject/abi"
import { useWeb3React } from "@web3-react/core"
import useContract from "hooks/useContract"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import NFPOSITIONMANAGER_ABI from "static/abis/NfPositionManagerAbi.json"
import incentiveKey from "temporaryData/incentiveKey"

const useStakeNft = (tokenId: number) => {
  const { active, account } = useWeb3React()

  const nftContract = useContract(
    active ? process.env.NEXT_PUBLIC_NFPOSITIOMANAGER_ADDRESS : null,
    NFPOSITIONMANAGER_ABI,
    true
  )

  const toast = useToast()

  // Temp. solution, should use 2 useSubmit hooks for this
  const stakeNft = async () => {
    // Deposit & stake in one call
    const depositAndStakeRes = await nftContract[
      "safeTransferFrom(address,address,uint256,bytes)"
    ](
      account,
      process.env.NEXT_PUBLIC_STAKING_REWARDS_CONTRACT_ADDRESS,
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
        title: "Successfully staked NFT!",
        duration: 4000,
        status: "success",
      })
    },
  })
}

export default useStakeNft
