import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
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
      onClose()
      setPickedStakeNfts([])
      mutate(active ? ["stakingRewards", chainId, account] : null)
      mutate(active ? ["nfts", chainId, account] : null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depositAndStakeResponse])

  // If the user has only 1 stakable NFT, stake it by default
  useEffect(() => {
    if (!isOpen || !userNfts || userNfts.filter((nft) => nft.canStake).length !== 1)
      return
    setPickedStakeNfts([userNfts.filter((nft) => nft.canStake)[0].tokenId])
  }, [isOpen, userNfts])

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      onClose={() => {
        onClose()
        setPickedStakeNfts([])
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Deposit &amp; Stake</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isUserNftsLoading ? (
            <Flex mb={8} alignItems="center" justifyContent="center">
              <Spinner size="lg" />
            </Flex>
          ) : (
            <VStack mb={8} alignItems="start">
              {userNfts?.filter((nft) => nft.canStake)?.length > 0 ? (
                <>
                  <Heading mb={4} w="full" fontWeight="light" textAlign="center">
                    Available to Stake
                  </Heading>
                  <Box
                    position="relative"
                    px={2}
                    width="full"
                    bgColor="seedclub.lightlime"
                    bgImage=""
                    borderColor="seedclub.white"
                    borderWidth={1}
                    borderRadius="lg"
                    overflow="hidden"
                    _before={{
                      content: '""',
                      bgImage: "url('/img/light-lime-bg.jpg')",
                      bgSize: "cover",
                      pos: "absolute",
                      inset: 0,
                      opacity: 0.75,
                    }}
                  >
                    <Box
                      position="relative"
                      maxH={56}
                      overflowY="auto"
                      className="custom-scrollbar"
                    >
                      <VStack mr={1} py={2}>
                        {userNfts
                          .filter((nft) => nft.canStake)
                          .map((nft) => (
                            <NftButton
                              key={nft.tokenId}
                              nft={nft}
                              active={pickedStakeNfts.includes(nft.tokenId)}
                              onClick={() => toggleNft(nft.tokenId)}
                            />
                          ))}
                      </VStack>
                    </Box>
                  </Box>
                </>
              ) : (
                <NftButton
                  title="No NFT Available"
                  infoText="Provide liquidity on Uniswap V3"
                  infoLink="#"
                />
              )}
            </VStack>
          )}

          <Text my={8} fontSize="xl" textAlign="center">
            This will deposit and stake your NFT into the Uniswap V3 Staking contract
            and start earning you rewards.
          </Text>

          <Flex justifyContent="center">
            <Button
              size="xl"
              variant="outline"
              borderWidth={1}
              colorScheme="whiteAlpha"
              borderColor="seedclub.white"
              color="seedclub.white"
              w="max-content"
              isLoading={isStakeNftLoading}
              isDisabled={pickedStakeNfts?.length < 1}
              loadingText="Staking"
              onClick={onDepositAndStake}
            >
              {`Deposit & Stake${
                pickedStakeNfts?.length > 1 ? ` (${pickedStakeNfts?.length})` : ""
              }`}
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default StakeModal
