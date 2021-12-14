import { Box, Container, Flex, HStack, Img, Text, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Link from "components/common/Link"
import Head from "next/head"
import { PropsWithChildren, ReactNode } from "react"
import JoinCommunity from "../JoinCommunity"
import Account from "./components/Account"
import AppMenu from "./components/AppMenu"

type Props = {
  imageUrl?: string
  title: string
  description?: string
  action?: ReactNode | undefined
}

const Layout = ({
  title,
  description,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { account } = useWeb3React()

  return (
    <>
      <Head>
        <title>{`${title}`}</title>
        <meta property="og:title" content={`${title}`} />
        {description && (
          <>
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
          </>
        )}
      </Head>

      <Box
        bgColor="seedclub.green.900"
        bgImage="url('/img/dark-green-original.jpg')"
        bgSize="100% 100%"
        // borderWidth={8}
        // borderColor="seedclub.white"
        minHeight="100vh"
      >
        <Box height="7.75rem" bgColor="seedclub.white">
          <Flex
            position="relative"
            justifyContent="space-between"
            alignItems="center"
            w="full"
            height={28}
            bgSize="100% auto"
            bgRepeat="no-repeat"
            borderWidth={8}
            borderColor="seedclub.white"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              width="full"
              height={0}
              borderWidth={48}
              sx={{
                borderImage: "url('/img/header-border-180x180.jpg')",
                borderImageSlice: "60 60",
                borderImageRepeat: "round",
              }}
            />
            <Link href="/" position="relative" ml="3.25rem">
              <Img
                h="3.75rem"
                bgColor="seedclub.white"
                src="/img/seedclub-logo.svg"
              />
            </Link>
            <HStack position="relative" spacing="2" mr={12}>
              <Account />
            </HStack>
          </Flex>
        </Box>
        <Container
          maxW="calc(var(--chakra-sizes-container-lg) - 15rem)"
          pt={1.5}
          pb={{ base: 20, md: 14 }}
          px={{ base: 4, sm: 6, md: 8, lg: 10 }}
        >
          {account ? (
            <>
              <AppMenu />
              {children}
              <JoinCommunity />
            </>
          ) : (
            <>
              <VStack spacing={0} mb={8} color="seedclub.white" textAlign="center">
                <Text fontSize="112px" fontFamily="heading" lineHeight="1.5">
                  Introducing
                </Text>
                <Text fontSize="350px" fontFamily="heading" lineHeight="1.1">
                  $CLUB
                </Text>
                <Text fontSize="36px" fontWeight="thin">
                  Starting today we're opening up access to the DAO.
                  <br /> This is an invitation to join us in shaping the future of
                  tokenized communities.
                </Text>
              </VStack>
              <JoinCommunity fixed />
            </>
          )}
        </Container>
      </Box>
    </>
  )
}

export default Layout
