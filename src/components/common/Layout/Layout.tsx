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
        borderWidth={8}
        borderColor="seedclub.white"
        bgColor="seedclub.green.900"
        bgImage="url('/img/noisy.png')"
        minHeight="100vh"
      >
        <Box pb={4} height={24} bgColor="seedclub.white">
          <Flex
            justifyContent="space-between"
            alignItems="center"
            px={4}
            w="full"
            height={20}
            bgImage="url('/img/pattern.png')"
            bgSize="auto 100%"
            borderWidth={1}
            borderColor="#23882E"
          >
            <Link href="/">
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
            <VStack spacing={0} color="seedclub.white" textAlign="center">
              <Text fontSize="7xl" fontFamily="display">
                Introducing
              </Text>
              <Text fontSize="15rem" fontFamily="display">
                $CLUB
              </Text>
              <Text fontSize="4xl">
                Starting today we’re opening up access to the DAO.
                <br /> This is an invitation to join us in shaping the future of
                tokenized communities.
              </Text>
            </VStack>
          )}
        </Container>
      </Box>
    </>
  )
}

export default Layout
