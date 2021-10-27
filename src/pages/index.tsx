import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
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
import Card from "components/common/Card"
import CopyableAddress from "components/common/CopyableAddress"
import JoinCommunity from "components/common/JoinCommunity"
import Layout from "components/common/Layout"

const AirdropPage = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Layout title="Airdrop">
      <Card p={8} fontFamily="display">
        <VStack spacing={8} fontWeight="semibold" textAlign="center">
          <Heading
            as="h1"
            fontFamily="display"
            fontSize={{ base: "4xl", md: "5xl" }}
          >
            Seed Club Airdrop
          </Heading>

          <Text fontSize="4xl">22:40:58</Text>

          <VStack spacing={1} fontSize="xl" pb={4}>
            <Text>
              You are on the{" "}
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
            <Text>2 $CLUB waiting to be claimed</Text>
          </VStack>

          <Button px={8} letterSpacing="wide" colorScheme="seedclub">
            Claim
          </Button>

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
                <Tr>
                  <Td>
                    <CopyableAddress
                      address="0xA861C07fEc05525F2DB7408E8C3319B8D8929B78"
                      decimals={4}
                      fontSize="sm"
                      fontWeight="normal"
                    />
                  </Td>
                  <Td isNumeric>2.0</Td>
                </Tr>
                <Tr>
                  <Td>
                    <CopyableAddress
                      address="0xA861C07fEc05525F2DB7408E8C3319B8D8929B78"
                      decimals={4}
                      fontSize="sm"
                      fontWeight="normal"
                    />
                  </Td>
                  <Td isNumeric>1.2</Td>
                </Tr>
              </Tbody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  )
}

export default AirdropPage
