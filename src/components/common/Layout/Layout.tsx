import {
  Box,
  Container,
  Flex,
  HStack,
  Img,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react"
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

  const logoSrc = useBreakpointValue({
    base: "/img/seedclub-logo-mobile.svg",
    sm: "/img/seedclub-logo.svg",
  })

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
        height="6.5rem"
        bgColor="seedclub.white"
        borderWidth="0.5rem"
        borderColor="seedclub.white"
      >
        <Flex
          position="relative"
          justifyContent="space-between"
          alignItems="center"
          w="full"
          height="5.5rem"
          bgSize="100% auto"
          bgRepeat="no-repeat"
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            width="full"
            height={0}
            borderWidth="2.5rem"
            sx={{
              borderImage: {
                base: "url('/img/mobile-header.jpg')",
                sm: "url('/img/header-border-180x180.jpg')",
              },
              borderImageSlice: "60 60",
              borderImageRepeat: "round",
            }}
          />
          <Link
            href="/"
            position="relative"
            mt="-0.5rem"
            ml={{ base: 2, sm: "2.55rem" }}
          >
            <Img
              h={{ base: "3.25rem", sm: "3.2rem" }}
              bgColor="seedclub.white"
              src={logoSrc}
            />
          </Link>
          <HStack
            position="relative"
            spacing="2"
            mt="-0.5rem"
            mr={{ base: 2, sm: "2.25rem" }}
          >
            <Account />
          </HStack>
        </Flex>
      </Box>
      <Box
        bgColor="seedclub.green.900"
        bgImage="url('/img/dark-green-bg-full.jpg')"
        bgSize="cover"
        minHeight="calc(100vh - 6.5rem)"
        borderWidth="0.5rem"
        borderTopWidth={0}
        borderColor="seedclub.white"
      >
        <Container
          maxW={account ? "42rem" : "full"}
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
              <VStack spacing={0} my={8} color="seedclub.white" textAlign="center">
                <Text
                  fontSize={{ base: "3.5rem", sm: "6rem" }}
                  fontFamily="heading"
                  lineHeight="1.5"
                >
                  Introducing
                </Text>
                <Text
                  fontSize={{ base: "9rem", sm: "18rem" }}
                  fontFamily="heading"
                  lineHeight={{ base: "1.25", sm: "1.1" }}
                >
                  $CLUB
                </Text>
                <Text
                  fontSize={{ base: "1rem", sm: "2rem" }}
                  lineHeight="1.2"
                  fontWeight="medium"
                >
                  Starting today we're opening up access to the DAO.
                  <br /> This is an invitation to join us in shaping the future of
                  <br />
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
