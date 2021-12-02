import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import NftButton from "components/common/NftButton"
import useTokenData from "hooks/useTokenData"
import { useEffect, useState } from "react"
import { mutate } from "swr"
import useStakeNft from "./hooks/useStakeNft"
import useUserNfts from "./hooks/useUserNfts"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const StakeModal = ({ isOpen, onClose }: Props): JSX.Element => {
  const { account, chainId, active } = useWeb3React()

  const {
    data: [, rewardTokenSymbol],
  } = useTokenData(process.env.NEXT_PUBLIC_REWARD_TOKEN_ADDRESS)

  const { isValidating: isUserNftsLoading, data: userNfts } = useUserNfts()
  const [pickedStakeNft, setPickedStakeNft] = useState(null)

  const {
    isLoading: isStakeNftLoading,
    onSubmit: onDepositAndStake,
    response: depositAndStakeResponse,
  } = useStakeNft(pickedStakeNft)

  useEffect(() => {
    if (depositAndStakeResponse) {
      onClose()
      setPickedStakeNft(null)
      mutate(active ? ["stakingRewards", chainId, account] : null)
      mutate(active ? ["nfts", chainId, account] : null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depositAndStakeResponse])

  // If the user has only 1 stakable NFT, stake it by default
  useEffect(() => {
    if (!isOpen || !userNfts || userNfts.filter((nft) => nft.canStake).length !== 1)
      return
    setPickedStakeNft(userNfts.filter((nft) => nft.canStake)[0].tokenId)
  }, [isOpen, userNfts])

  useEffect(() => {
    if (!pickedStakeNft || userNfts.filter((nft) => nft.canStake).length !== 1)
      return
    onDepositAndStake()
  }, [pickedStakeNft])

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose()
        setPickedStakeNft(null)
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Deposit & Stake</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isUserNftsLoading ? (
            <Flex alignItems="center" justifyContent="center">
              <Spinner size="lg" />
            </Flex>
          ) : (
            <VStack alignItems="start">
              {userNfts?.filter((nft) => nft.canStake)?.length > 0 ? (
                userNfts
                  .filter((nft) => nft.canStake)
                  .map((nft) => (
                    <NftButton
                      key={nft.tokenId}
                      nft={nft}
                      active={pickedStakeNft === nft.tokenId}
                      onClick={() => setPickedStakeNft(nft.tokenId)}
                    />
                  ))
              ) : (
                <Text>Seems like you don't have any NFTs.</Text>
              )}
            </VStack>
          )}

          {pickedStakeNft && (
            <ScaleFade in={pickedStakeNft}>
              <Text my={4}>
                In order to earn {rewardTokenSymbol} rewards, you must deposit this
                NFT to the Uniswap Staking contract, and stake it in Seed Club's
                farm.
              </Text>
              <Button
                variant="outline"
                colorScheme="whiteAlpha"
                borderColor="seedclub.white"
                color="seedclub.white"
                w="max-content"
                mr={3}
                onClick={() => {
                  onClose()
                  setPickedStakeNft(null)
                }}
              >
                Cancel
              </Button>
              <Button
                w="max-content"
                isLoading={isStakeNftLoading}
                loadingText="Staking"
                colorScheme="white"
                onClick={onDepositAndStake}
              >
                Deposit &amp; Stake
              </Button>
            </ScaleFade>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default StakeModal
