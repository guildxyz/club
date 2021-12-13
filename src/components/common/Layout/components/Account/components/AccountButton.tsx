import { Button } from "@chakra-ui/react"

const AccountButton = ({ children, ...rest }): JSX.Element => (
  <Button size="xl" flexGrow={1} colorScheme="seedclub" {...rest}>
    {children}
  </Button>
)

export default AccountButton
