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
              {userNfts?.length > 0 ? (
                userNfts.map((nft) => (
                  <Button
                    key={nft}
                    isFullWidth
                    size="xl"
                    justifyContent="start"
                    boxSizing="border-box"
                    borderColor="seedclub.green.700"
                    borderWidth={pickedStakeNft === nft ? 3 : 0}
                    onClick={() => setPickedStakeNft(nft)}
                  >
                    {nft}
                  </Button>
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
                fontFamily="display"
                w="max-content"
                colorScheme="gray"
                mr={3}
                onClick={() => {
                  onClose()
                  setPickedStakeNft(null)
                }}
              >
                Cancel
              </Button>
              <Button
                fontFamily="display"
                w="max-content"
                isLoading={isStakeNftLoading}
                loadingText="Staking"
                colorScheme="seedclub"
                onClick={onDepositAndStake}
              >
                Deposit & Stake
              </Button>
            </ScaleFade>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default StakeModal
