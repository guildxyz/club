import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import useContract from "hooks/useContract"
import { useEffect, useState } from "react"
import NFPOSITIONMANAGER_ABI from "static/abis/NfPositionManagerAbi.json"
import addresses from "temporaryData/addresses"

const useSumLiquidity = (tokenIdArray: Array<number>) => {
  const [liquiditySum, setLiquiditySum] = useState("0.00")
  const { active } = useWeb3React()

  const nftContract = useContract(
    active ? addresses.NFPOSITIOMANAGER_ADDRESS : null,
    NFPOSITIONMANAGER_ABI,
    true
  )

  const countNewLiquidity = async () => {
    if (!tokenIdArray || tokenIdArray.length === 0) {
      setLiquiditySum("0.00")
      return
    }

    let newLiquiditySum = 0

    for (let i = 0; i < tokenIdArray.length; i++) {
      if (tokenIdArray[i] !== null) {
        const tokenData = await nftContract?.positions(+tokenIdArray[i])
        const { liquidity } = tokenData
        newLiquiditySum += +formatUnits(liquidity)
      }
    }

    setLiquiditySum(newLiquiditySum.toFixed(2))
  }

  useEffect(() => {
    countNewLiquidity()
  }, [tokenIdArray])

  return liquiditySum
}

export default useSumLiquidity
