import {
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
import { useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import CopyableAddress from "components/common/CopyableAddress"
import JoinCommunity from "components/common/JoinCommunity"
import Layout from "components/common/Layout"
import useClaim from "components/index/hooks/useClaim"
import MerkleDistributor from "constants/MerkleDistributor"
import useMerkleDistributor from "hooks/useMerkleDistributor"
import useTokenData from "hooks/useTokenData"
import { useMemo } from "react"

const AirdropPage = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { account } = useWeb3React()
  const eligible = useMemo(
    () => Object.keys(MerkleDistributor.claims).includes(account),
    [account]
  )
  const {
    isValidating: isMerkleDistributorLoading,
    data: [isClaimed, token],
  } = useMerkleDistributor(account)
  const {
    isValidating: isTokenValidating,
    data: [, tokenSymbol],
  } = useTokenData(token)

  const { onSubmit, isLoading } = useClaim()

  if (isMerkleDistributorLoading)
    return (
      <Layout title="Airdrop">
        <Card p={8} fontFamily="display">
          <VStack spacing={8} fontWeight="semibold" textAlign="center">
            <Spinner />
          </VStack>
        </Card>
      </Layout>
    )

  return (
    <Layout title="Airdrop">
      <Card p={8} fontFamily="display">
        <VStack spacing={8} fontWeight="semibold" textAlign="center">
          <VStack spacing={2}>
            {account && !isMerkleDistributorLoading && (
              <Flex
                boxSize={16}
                bgColor="gray.300"
                rounded="full"
                borderWidth={3}
                borderColor="seedclub.white"
                alignItems="center"
                justifyContent="center"
              >
                {isTokenValidating && !tokenSymbol ? (
                  <Spinner />
                ) : (
                  <Text as="span" fontWeight="bold" fontFamily="body" fontSize="lg">
                    {tokenSymbol}
                  </Text>
                )}
              </Flex>
            )}

            <Heading
              as="h1"
              fontFamily="display"
              fontSize={{ base: "4xl", md: "5xl" }}
            >
              Seed Club Airdrop
            </Heading>
          </VStack>

          {/* <Text fontSize="4xl">22:40:58</Text> */}

          {account ? (
            <>
              <VStack spacing={1} fontSize="xl" pb={4}>
                {isClaimed ? (
                  <Text fontSize="xl">You've already claimed your tokens!</Text>
                ) : (
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
                      <Text>{`${parseInt(
                        MerkleDistributor.claims[account].amount,
                        16
                      )} ${tokenSymbol} waiting to be claimed`}</Text>
                    )}
                  </>
                )}
              </VStack>

              <Button
                px={8}
                letterSpacing="wide"
                colorScheme="seedclub"
                isDisabled={isClaimed}
                isLoading={isLoading}
                onClick={onSubmit}
              >
                Claim
              </Button>
            </>
          ) : (
            <Text fontSize="xl">
              Please connect your wallet in order to continue!
            </Text>
          )}

          <JoinCommunity />
        </VStack>
      </Card>

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
                      {parseInt(MerkleDistributor.claims[address].amount, 16)}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  )
}

export default AirdropPage
