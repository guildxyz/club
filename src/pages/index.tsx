import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import CopyableAddress from "components/common/CopyableAddress"
import PageContent from "components/common/PageContent"
import TokenImage from "components/common/TokenImage"
import Countdown from "components/index/Countdown"
import useClaim from "components/index/hooks/useClaim"
import useMerkleDistributor from "components/index/hooks/useMerkleDistributor"
import useWithdraw from "components/index/hooks/useWithdraw"
import MerkleDistributor from "constants/MerkleDistributor"
import useTokenDataWithImage from "hooks/useTokenDataWithImage"
import { useMemo } from "react"

const AirdropPage = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { account, chainId } = useWeb3React()
  const eligible = useMemo(
    () => Object.keys(MerkleDistributor.claims).includes(account),
    [account]
  )
  const {
    isValidating: isMerkleDistributorLoading,
    data: [isClaimed, token, distributionEnd, owner],
  } = useMerkleDistributor(account)
  const {
    isLoading: isTokenValidating,
    tokenSymbol,
    tokenImage,
    tokenDecimals,
  } = useTokenDataWithImage(token)

  const ended = useMemo(
    () =>
      distributionEnd
        ? new Date(distributionEnd).getTime() < new Date().getTime()
        : false,
    [distributionEnd]
  )

  const { onSubmit: onClaimSubmit, isLoading: isClaimLoading } = useClaim()
  const { onSubmit: onWithdrawSubmit, isLoading: isWithdrawLoading } = useWithdraw()

  return (
    <PageContent
      layoutTitle="Airdrop"
      title="Seed Club Airdrop"
      header={
        account &&
        !isMerkleDistributorLoading &&
        (tokenImage || tokenSymbol) && (
          <TokenImage
            isLoading={isTokenValidating}
            tokenSymbol={tokenSymbol}
            tokenImage={tokenImage}
          />
        )
      }
    >
      {account && !tokenSymbol && (
        <>
          {isMerkleDistributorLoading ? (
            <Spinner mx="auto" />
          ) : (
            <Text fontSize="lg">Could not fetch reward token.</Text>
          )}
        </>
      )}

      {account && tokenSymbol && (
        <>
          <VStack spacing={1} fontSize="xl" pb={4}>
            {isClaimed ? (
              <Text fontSize="xl">You've already claimed your tokens!</Text>
            ) : (
              <>
                <Countdown
                  timestamp={distributionEnd}
                  endText="This airdrop has ended!"
                />
                {!ended && (
                  <>
                    <Text>
                      {`You are ${!eligible ? "not" : ""} on the `}
                      <Text
                        as="span"
                        tabIndex={0}
                        px={1}
                        py={0.5}
                        bgColor="seedclub.green.800"
                        color="seedclub.white"
                        cursor="pointer"
                        _focus={{ outline: "none" }}
                        _hover={{
                          color: "seedclub.lightlime",
                        }}
                        _focusVisible={{
                          color: "seedclub.lightlime",
                        }}
                        onClick={onOpen}
                      >
                        whitelist
                      </Text>
                    </Text>
                    {eligible && (
                      <Text>{`${formatUnits(
                        MerkleDistributor.claims[account].amount,
                        tokenDecimals || 18
                      )} ${tokenSymbol} waiting to be claimed`}</Text>
                    )}
                  </>
                )}
              </>
            )}
          </VStack>

          {ended && owner && owner?.toLowerCase() === account?.toLowerCase() && (
            <Button
              px={8}
              letterSpacing="wide"
              colorScheme="seedclub"
              isDisabled={isClaimed}
              isLoading={isWithdrawLoading}
              onClick={onWithdrawSubmit}
            >
              Withdraw unclaimed tokens
            </Button>
          )}

          {!ended && owner?.toLowerCase() !== account?.toLowerCase() && (
            <Button
              px={8}
              letterSpacing="wide"
              colorScheme="seedclub"
              isDisabled={isClaimed}
              isLoading={isClaimLoading}
              onClick={onClaimSubmit}
            >
              Claim
            </Button>
          )}
        </>
      )}

      {!account && (
        <Text fontSize="xl">Please connect your wallet in order to continue!</Text>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Whitelist</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table variant="simple" size="sm">
              <TableCaption>Whitelisted addresses</TableCaption>
              <Thead>
                <Tr>
                  <Th>Address</Th>
                  <Th isNumeric>Amount</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Object.keys(MerkleDistributor.claims).map((address) => (
                  <Tr key={address}>
                    <Td>
                      <CopyableAddress
                        address={address}
                        decimals={4}
                        fontSize="sm"
                        fontWeight="normal"
                      />
                    </Td>
                    <Td isNumeric>
                      {formatUnits(
                        MerkleDistributor.claims[address].amount,
                        tokenDecimals || 18
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
    </PageContent>
  )
}

export default AirdropPage
