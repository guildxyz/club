import { HStack } from "@chakra-ui/react"
import Link from "components/common/Link"
import { useRouter } from "next/router"

const AppMenu = (): JSX.Element => {
  const router = useRouter()

  return (
    <HStack
      my={8}
      spacing={8}
      fontSize={{ base: "2xl", md: "3xl" }}
      color="seedclub.white"
    >
      <Link
        href="/"
        _hover={{ textDecoration: "none", color: "seedclub.lightlime" }}
        borderBottomWidth={2}
        borderBottomColor={
          router.asPath === "/" ? "seedclub.lightlime" : "transparent"
        }
      >
        CLUBdrop
      </Link>
      <Link
        href="/liquidity-farming"
        _hover={{ textDecoration: "none", color: "seedclub.lightlime" }}
        borderBottomWidth={2}
        borderBottomColor={
          router.asPath === "/liquidity-farming"
            ? "seedclub.lightlime"
            : "transparent"
        }
      >
        Liquidity Farming
      </Link>
    </HStack>
  )
}

export default AppMenu
