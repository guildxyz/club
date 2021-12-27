import { Box, HStack, Text } from "@chakra-ui/react"
import Link from "components/common/Link"
import useUsersLatestCohort from "components/vesting/hooks/useUsersLatestCohort"
import { useRouter } from "next/router"

const AppMenu = (): JSX.Element => {
  const router = useRouter()
  const { isValidating: isUsersLatestCohortLoading, data: usersLatestCohort } =
    useUsersLatestCohort()

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
        <Link
          href="/"
          _hover={{ textDecoration: "none" }}
          textDecoration={router.asPath === "/" ? "underline" : "none"}
        >
          <Text as="span" width="max-content">
            CLUBDrop
          </Text>
        </Link>
        {!isUsersLatestCohortLoading && usersLatestCohort && (
          <Link
            href="/vesting"
            _hover={{ textDecoration: "none" }}
            textDecoration={router.asPath === "/vesting" ? "underline" : "none"}
          >
            <Text as="span" width="max-content">
              Vesting
            </Text>
          </Link>
        )}
      </HStack>
    </Box>
  )
}

export default AppMenu
