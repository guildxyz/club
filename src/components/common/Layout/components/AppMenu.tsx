import { HStack } from "@chakra-ui/react"
import Link from "components/common/Link"
import { useRouter } from "next/router"

const AppMenu = (): JSX.Element => {
  const router = useRouter()

  return (
    <HStack
      my={6}
      spacing={16}
      fontSize="48px"
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
