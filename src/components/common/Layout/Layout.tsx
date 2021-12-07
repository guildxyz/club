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
        bgImage="url('/img/dark-green-bg-full.jpg')"
        bgSize="100% 100%"
        borderWidth={8}
        borderColor="seedclub.white"
        minHeight="100vh"
      >
        <Box pb={4} height={24} bgColor="seedclub.white">
          <Flex
            justifyContent="space-between"
            alignItems="center"
            px={4}
            w="full"
            height={20}
            bgImage="url('/img/grid-25x150.jpg')"
            bgSize="auto 100%"
            borderTopWidth={8}
            borderLeftWidth={8}
            borderRightWidth={8}
            borderColor="seedclub.white"
          >
            <Link href="/" mr={8}>
              <Img h={10} bgColor="seedclub.white" src="/img/seedclub-logo.svg" />
            </Link>
            <HStack spacing="2">
              <Account />
            </HStack>
          </Flex>
        </Box>
        <Container
          maxW={account ? "container.md" : "container.lg"}
          pt={{ base: 4, md: 9 }}
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
                <Text fontSize="7xl" fontFamily="heading" lineHeight="1">
                  Introducing
                </Text>
                <Text fontSize="15rem" fontFamily="heading" lineHeight="1">
                  $CLUB
                </Text>
                <Text fontSize="3xl" fontWeight="thin">
                  Starting today we’re opening up access to the DAO.
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
