import { Button, useBreakpointValue } from "@chakra-ui/react"

const AccountButton = ({ children, ...rest }): JSX.Element => {
  const buttonSize = useBreakpointValue({ base: "md", sm: "xl" })

  return (
    <Button size={buttonSize} flexGrow={1} colorScheme="seedclub" {...rest}>
      {children}
    </Button>
  )
}

export default AccountButton
