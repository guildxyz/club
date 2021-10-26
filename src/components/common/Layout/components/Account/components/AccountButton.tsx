import { Button } from "@chakra-ui/react"

const AccountButton = ({ children, ...rest }): JSX.Element => (
  <Button flexGrow={1} borderRadius="2xl" colorScheme="whiteAlpha" {...rest}>
    {children}
  </Button>
)

export default AccountButton
