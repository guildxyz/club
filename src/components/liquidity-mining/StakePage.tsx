import { Box, Button, Flex, Spinner, Text, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import NftButton from "components/common/NftButton"
import { useEffect, useState } from "react"
import { mutate } from "swr"
import useStakeNft from "./hooks/useStakeNft"
import useUserNfts from "./hooks/useUserNfts"

type Props = {
  onClose: () => void
}

const StakePage = ({ onClose }: Props): JSX.Element => {
  const { account, chainId, active } = useWeb3React()

  const { isValidating: isUserNftsLoading, data: userNfts } = useUserNfts()
  const [pickedStakeNfts, setPickedStakeNfts] = useState([])

  const toggleNft = (tokenId: number) => {
    const newNftList = [...pickedStakeNfts]
    if (newNftList.includes(tokenId)) {
      setPickedStakeNfts(newNftList.filter((nft) => nft !== tokenId))
      return
    }

    setPickedStakeNfts(newNftList.concat([tokenId]))
  }

  const {
    isLoading: isStakeNftLoading,
    onSubmit: onDepositAndStake,
    response: depositAndStakeResponse,
  } = useStakeNft(pickedStakeNfts)

  useEffect(() => {
    if (depositAndStakeResponse) {
      setPickedStakeNfts([])
      mutate(active ? ["stakingRewards", chainId, account] : null)
      mutate(active ? ["nfts", chainId, account] : null)
      onClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depositAndStakeResponse])

  // If the user has only 1 stakable NFT, pick it by default
  useEffect(() => {
    if (!userNfts || userNfts.filter((nft) => nft.canStake).length !== 1) return
    setPickedStakeNfts([userNfts.filter((nft) => nft.canStake)[0].tokenId])
  }, [userNfts])

  return (
    <>
      <Text my={4}>
        Staking will deposit your NFT into the Uniswap V3 Staking contract and start
        earning you rewards.
      </Text>

      {isUserNftsLoading ? (
        <Flex mb={8} alignItems="center" justifyContent="center">
          <Spinner size="lg" />
        </Flex>
      ) : (
        <Box mb={8} maxH={72} overflowY="auto" px={2} className="custom-scrollbar">
          <VStack alignItems="start">
            {userNfts?.filter((nft) => nft.canStake)?.length > 0 ? (
              userNfts
                .filter((nft) => nft.canStake)
                .map((nft) => (
                  <NftButton
                    key={nft.tokenId}
                    nft={nft}
                    active={pickedStakeNfts.includes(nft.tokenId)}
                    onClick={() => toggleNft(nft.tokenId)}
                  />
                ))
            ) : (
              <Text>Seems like you don't have any NFTs.</Text>
            )}
          </VStack>
        </Box>
      )}

      <Button
        variant="outline"
        w="max-content"
        mr={3}
        onClick={() => {
          setPickedStakeNfts([])
          onClose()
        }}
      >
        Cancel
      </Button>
      <Button
        w="max-content"
        isLoading={isStakeNftLoading}
        isDisabled={pickedStakeNfts?.length < 1}
        loadingText="Staking"
        colorScheme="seedclub"
        onClick={onDepositAndStake}
      >
        {`Deposit & Stake${
          pickedStakeNfts?.length > 1 ? ` (${pickedStakeNfts?.length})` : ""
        }`}
      </Button>
    </>
  )
}

export default StakePage
