import { ChakraProvider } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import theme from "theme"

const Chakra = ({ children }: PropsWithChildren<any>): JSX.Element => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
)

export default Chakra
