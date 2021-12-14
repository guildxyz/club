import { Button, Img } from "@chakra-ui/react"

type Props = {
  name: string
  onClick: () => void
  iconUrl: string
  disabled?: boolean
  isActive: boolean
  isLoading: boolean
}

const ConnectorButton = ({
  name,
  onClick,
  iconUrl,
  disabled,
  isActive,
  isLoading,
}: Props): JSX.Element => (
  <Button
    isFullWidth
    onClick={onClick}
    leftIcon={
      <Img src={`/walletLogos/${iconUrl}`} alt={`${name} logo`} boxSize={8} />
    }
    disabled={disabled}
    isLoading={isLoading}
    variant="outline"
    colorScheme="whiteAlpha"
    spinnerPlacement="end"
    loadingText={`${name} - connecting...`}
    size="xl"
    justifyContent="center"
    color="seedclub.white"
    borderColor="seedclub.white"
    fontSize="4xl"
    fontWeight="medium"
    h="4.5rem"
    _active={{
      borderColor: "seedclub.lightlime",
      color: "seedclub.lightlime",
    }}
  >
    {`${name} ${isActive ? " - connected" : ""}`}
  </Button>
)

export default ConnectorButton
