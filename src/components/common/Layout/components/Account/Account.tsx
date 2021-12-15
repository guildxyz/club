import { HStack, Text, useDisclosure } from "@chakra-ui/react"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { LinkBreak } from "phosphor-react"
import { useContext } from "react"
import shortenHex from "utils/shortenHex"
import AccountButton from "./components/AccountButton"
import AccountModal from "./components/AccountModal"
import Identicon from "./components/Identicon"
import useENSName from "./hooks/useENSName"

const Account = (): JSX.Element => {
  const { error, account } = useWeb3React()
  const { openWalletSelectorModal, triedEager, openNetworkModal } =
    useContext(Web3Connection)
  const ENSName = useENSName(account)
  const {
    isOpen: isAccountModalOpen,
    onOpen: onAccountModalOpen,
    onClose: onAccountModalClose,
  } = useDisclosure()

  if (typeof window === "undefined") {
    return <AccountButton isLoading>Connect to a wallet</AccountButton>
  }

  if (error instanceof UnsupportedChainIdError) {
    return (
      <AccountButton
        leftIcon={<LinkBreak />}
        colorScheme="red"
        onClick={openNetworkModal}
      >
        Wrong Network
      </AccountButton>
    )
  }
  if (!account) {
    return (
      <AccountButton isLoading={!triedEager} onClick={openWalletSelectorModal}>
        Connect
      </AccountButton>
    )
  }
  return (
    <>
      <HStack spacing={3}>
        <Identicon address={account} size={64} />
        <AccountButton onClick={onAccountModalOpen}>
          <Text as="span">{ENSName || `${shortenHex(account, 3)}`}</Text>
        </AccountButton>
      </HStack>

      <AccountModal isOpen={isAccountModalOpen} onClose={onAccountModalClose} />
    </>
  )
}

export default Account
