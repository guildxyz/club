import { Box, HStack, Text } from "@chakra-ui/react"
import Link from "components/common/Link"
import { useRouter } from "next/router"

const MENUITEMS: Array<{ label: string; url: string }> = [
  {
    label: "CLUBDrop",
    url: "/",
  },
  {
    label: "DAO 50 Awards",
    url: "/dao-50-awards",
  },
  {
    label: "Liquidity Mining",
    url: "/liquidity-mining",
  },
  {
    label: "Vesting",
    url: "/vesting",
  },
]

const AppMenu = (): JSX.Element => {
  const router = useRouter()

  return (
    <Box
      mx={{ base: "-1rem", sm: "auto" }}
      w={{ base: "calc(100%+1rem)", sm: "max-content" }}
      overflowX="auto"
    >
      <HStack
        my={6}
        px={{ base: "2rem", sm: 0 }}
        spacing={{ base: 8, sm: 16 }}
        fontSize={{ base: "1.75rem", sm: "2.5rem" }}
        color="seedclub.white"
        justifyContent="center"
        fontFamily="heading"
        width="max-content"
      >
        {MENUITEMS.map((menuItem) => (
          <Link
            key={menuItem.url}
            href={menuItem.url}
            _hover={{ textDecoration: "none" }}
            textDecoration={router.asPath === menuItem.url ? "underline" : "none"}
          >
            <Text as="span" width="max-content">
              {menuItem.label}
            </Text>
          </Link>
        ))}
      </HStack>
    </Box>
  )
}

export default AppMenu
