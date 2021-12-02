import { Box, Button, Img, Tooltip } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"

type Props = {
  chain: string
  requestNetworkChange: () => void
}

const NetworkButton = ({ chain, requestNetworkChange }: Props) => {
  const { chainId } = useWeb3React()

  const isCurrentChain = Chains[chain] === chainId

  return (
    <Tooltip
      isDisabled={!isCurrentChain}
      label={`${RPC[chain].chainName} is currently selected`}
    >
      <Box>
        <Button
          isFullWidth
          onClick={requestNetworkChange}
          leftIcon={
            <Img
              src={RPC[chain].iconUrls[0]}
              alt={`${RPC[chain].chainName} logo`}
              boxSize={6}
            />
          }
          disabled={isCurrentChain}
          variant="outline"
          colorScheme="whiteAlpha"
          size="xl"
          justifyContent="space-between"
          color="seedclub.white"
          borderColor="seedclub.white"
          fontWeight="medium"
        >
          {RPC[chain].chainName}
        </Button>
      </Box>
    </Tooltip>
  )
}

export default NetworkButton
