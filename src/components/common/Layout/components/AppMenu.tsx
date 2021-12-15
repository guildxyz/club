import { HStack } from "@chakra-ui/react"
import Link from "components/common/Link"
import { useRouter } from "next/router"

const AppMenu = (): JSX.Element => {
  const router = useRouter()

  return (
    <HStack
      my={6}
      spacing={{ base: 8, sm: 16 }}
      fontSize={{ base: "1.75rem", sm: "2.5rem" }}
      color="seedclub.white"
      justifyContent="center"
      fontFamily="heading"
    >
      <Link
        href="/"
        _hover={{ textDecoration: "none" }}
        textDecoration={router.asPath === "/" ? "underline" : "none"}
      >
        CLUBdrop
      </Link>
      <Link
        href="/liquidity-mining"
        _hover={{ textDecoration: "none" }}
        textDecoration={router.asPath === "/liquidity-mining" ? "underline" : "none"}
      >
        Liquidity Mining
      </Link>
    </HStack>
  )
}

export default AppMenu
