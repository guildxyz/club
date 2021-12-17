import { defaultAbiCoder } from "@ethersproject/abi"
import { useWeb3React } from "@web3-react/core"
import incentiveKey from "data/incentiveKey"
import useContract from "hooks/useContract"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import NFPOSITIONMANAGER_ABI from "static/abis/NfPositionManagerAbi.json"
import parseError from "utils/parseError"

const useStakeNft = (tokenIds: Array<number>) => {
  const { active, account } = useWeb3React()

  const nftContract = useContract(
    active ? process.env.NEXT_PUBLIC_NFPOSITIOMANAGER_ADDRESS : null,
    NFPOSITIONMANAGER_ABI,
    true
  )

  const toast = useToast()

  // Temp. solution, should use 2 useSubmit hooks for this
  const stakeNft = async () => {
    // Deposit & stake every NFT in one call
    const multicall = await nftContract.multicall(
      tokenIds?.map((tokenId) =>
        nftContract.interface.encodeFunctionData(
          "safeTransferFrom(address,address,uint256,bytes)",
          [
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
            ),
          ]
        )
      )
    )

    return multicall?.wait().then((res) => {
      if (res.status === 0) throw new Error("An unknown error occurred.")
      return res
    })
  }

  return useSubmit<null, any>(stakeNft, {
    onError: (e) => {
      console.error(e)
      toast({
        title: "Error staking NFT",
        description: parseError(e),
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
