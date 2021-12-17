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
import { NFT } from "data/types"
import { useEffect, useState } from "react"
import { mutate } from "swr"
import useUnstakeWithdrawClaim from "./hooks/useUnstakeWithdrawClaim"
import useUserNfts from "./hooks/useUserNfts"

type Props = {
  isOpen: boolean
  onClose: () => void
  depositData: Array<NFT>
  claimMode: "claim" | "unstakeWithdrawClaim"
}

const UnstakeModal = ({
  isOpen,
  onClose,
  depositData,
  claimMode,
}: Props): JSX.Element => {
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

  // If the user has only 1 unstakable NFT, stake it by default
  useEffect(() => {
    if (!isOpen || !depositData || depositData.length !== 1) return
    setPickedUnstakeNfts([depositData[0].tokenId])
  }, [isOpen, depositData])

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      onClose={() => {
        onClose()
        setPickedUnstakeNfts([])
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {claimMode === "claim" ? "Claim" : "Claim & unstake"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isUserNftsLoading ? (
            <Flex alignItems="center" justifyContent="center">
              <Spinner size="lg" />
            </Flex>
          ) : (
            <VStack alignItems="start">
              {depositData?.length > 0 ? (
                <>
                  <Heading mb={4} w="full" fontWeight="light" textAlign="center">
                    Staked V3 NFTs
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
                        {depositData.map((nft) => (
                          <NftButton
                            key={nft.tokenId}
                            nft={nft}
                            active={pickedUnstakeNfts.includes(nft.tokenId)}
                            onClick={() => toggleNft(nft.tokenId)}
                          />
                        ))}
                      </VStack>
                    </Box>
                  </Box>
                </>
              ) : (
                <Text>Seems like you don't have any staked NFTs.</Text>
              )}
            </VStack>
          )}

          <Text my={8} fontSize={{ base: "md", sm: "xl" }} textAlign="center">
            Claiming rewards will unstake and withdraw your NFT. We recommend only
            doing this when you're ready to claim a lump sum of rewards as the gas
            cost will likely be high.
          </Text>

          <Flex justifyContent="center">
            <Button
              size="xl"
              variant="outline"
              borderWidth={1}
              colorScheme="whiteAlpha"
              w="max-content"
              color="seedclub.white"
              borderColor="seedclub.white"
              isLoading={isClaimLoading}
              isDisabled={pickedUnstakeNfts?.length < 1}
              loadingText="Claiming"
              onClick={onClaimSubmit}
            >
              {claimMode === "claim" ? "Claim" : "Claim & unstake"}
              {pickedUnstakeNfts?.length > 1
                ? ` (${pickedUnstakeNfts?.length})`
                : ""}
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default UnstakeModal
