import { HStack } from "@chakra-ui/react"
import Link from "components/common/Link"
import { useRouter } from "next/router"

const AppMenu = (): JSX.Element => {
  const router = useRouter()

  return (
    <HStack
      my={8}
      spacing={8}
      fontSize={{ base: "3xl", md: "5xl" }}
      color="seedclub.white"
      justifyContent="center"
      fontFamily="heading"
    >
      <Link
        href="/"
        _hover={{ textDecoration: "none", color: "seedclub.white" }}
        borderBottomWidth={2}
        borderBottomColor={router.asPath === "/" ? "seedclub.white" : "transparent"}
      >
        CLUBdrop
      </Link>
      <Link
        href="/liquidity-farming"
        _hover={{ textDecoration: "none", color: "seedclub.white" }}
        borderBottomWidth={2}
        borderBottomColor={
          router.asPath === "/liquidity-farming" ? "seedclub.white" : "transparent"
        }
      >
        Liquidity Farming
      </Link>
    </HStack>
  )
}

export default AppMenu
