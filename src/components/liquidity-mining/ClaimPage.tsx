import { Button, Flex, Spinner, Text, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import NftButton from "components/common/NftButton"
import { useEffect, useState } from "react"
import { mutate } from "swr"
import { NFT } from "temporaryData/types"
import useUnstakeWithdrawClaim from "./hooks/useUnstakeWithdrawClaim"
import useUserNfts from "./hooks/useUserNfts"

type Props = {
  onClose: () => void
  depositData: Array<NFT>
  claimMode: "claim" | "unstakeWithdrawClaim"
}

const ClaimPage = ({ onClose, depositData, claimMode }: Props): JSX.Element => {
  const { account, chainId, active } = useWeb3React()

  const { isValidating: isUserNftsLoading } = useUserNfts()
  const [pickedUnstakeNfts, setPickedUnstakeNfts] = useState([])

  const toggleNft = (tokenId: number) => {
    const newNftList = [...pickedUnstakeNfts]
    if (newNftList.includes(tokenId)) {
      setPickedUnstakeNfts(newNftList.filter((nft) => nft !== tokenId))
      return
    }

    setPickedUnstakeNfts(newNftList.concat([tokenId]))
  }

  const {
    isLoading: isClaimLoading,
    onSubmit: onClaimSubmit,
    response: claimResponse,
  } = useUnstakeWithdrawClaim(pickedUnstakeNfts, claimMode)

  useEffect(() => {
    if (claimResponse) {
      setPickedUnstakeNfts([])
      onClose()
      mutate(active ? ["stakingRewards", chainId, account] : null)
      mutate(active ? ["nfts", chainId, account] : null)
    }
  }, [claimResponse])

  // If the user has only 1 unstakable NFT, pick it by default
  useEffect(() => {
    if (!depositData || depositData.length !== 1) return
    setPickedUnstakeNfts([depositData[0].tokenId])
  }, [depositData])

  return (
    <>
      <Text my={4}>
        Claiming rewards will unstake your NFT. We recommend only doing this when
        you’re ready to claim a lump sum of rewards as the gas cost will likely be
        high.
      </Text>
      {isUserNftsLoading ? (
        <Flex mb={8} alignItems="center" justifyContent="center">
          <Spinner size="lg" />
        </Flex>
      ) : (
        <VStack mb={8} alignItems="start">
          {depositData?.length > 0 ? (
            depositData.map((nft) => (
              <NftButton
                key={nft.tokenId}
                nft={nft}
                active={pickedUnstakeNfts.includes(nft.tokenId)}
                onClick={() => toggleNft(nft.tokenId)}
              />
            ))
          ) : (
            <Text>Seems like you don't have any staked NFTs.</Text>
          )}
        </VStack>
      )}

      <Button
        variant="outline"
        mr={3}
        w="max-content"
        onClick={() => {
          setPickedUnstakeNfts([])
          onClose()
        }}
      >
        Cancel
      </Button>
      <Button
        w="max-content"
        isLoading={isClaimLoading}
        isDisabled={pickedUnstakeNfts?.length < 1}
        loadingText="Claiming"
        colorScheme="seedclub"
        onClick={onClaimSubmit}
      >
        {claimMode === "claim" ? "Claim rewards" : "Claim rewards & Unstake NFTs"}
        {pickedUnstakeNfts?.length > 1 ? ` (${pickedUnstakeNfts?.length})` : ""}
      </Button>
    </>
  )
}

export default ClaimPage
