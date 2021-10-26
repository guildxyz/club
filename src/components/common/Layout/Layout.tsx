import { Box, Container, Flex, HStack, Icon, IconButton } from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"
import Head from "next/head"
import NextLink from "next/link"
import { House } from "phosphor-react"
import { PropsWithChildren, ReactNode } from "react"
import Account from "./components/Account"
import AppMenu from "./components/AppMenu"
import InfoMenu from "./components/InfoMenu"

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
  const router = useRouter()

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
      <Box bgColor="seedclub.green.900" minHeight="100vh">
        <Flex w="full" justifyContent="space-between" alignItems="center" p="2">
          {router?.asPath !== "/" ? (
            <NextLink passHref href="/">
              <IconButton
                as="a"
                aria-label="Home"
                variant="ghost"
                isRound
                h="10"
                icon={<Icon width="1.2em" height="1.2em" as={House} />}
              />
            </NextLink>
          ) : (
            <Box />
          )}
          <HStack spacing="2">
            <Account />
            <InfoMenu />
          </HStack>
        </Flex>
        <Container
          maxW="container.sm"
          pt={{ base: 4, md: 9 }}
          pb={{ base: 20, md: 14 }}
          px={{ base: 4, sm: 6, md: 8, lg: 10 }}
        >
          <AppMenu />
          {children}
        </Container>
      </Box>
    </>
  )
}

export default Layout
