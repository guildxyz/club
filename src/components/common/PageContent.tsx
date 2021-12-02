import { Box, Heading, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import { PropsWithChildren } from "react"

type Props = {
  header?: JSX.Element
  layoutTitle: string
  title: string | JSX.Element
  subTitle?: JSX.Element
}

const PageContent = ({
  header,
  layoutTitle,
  title,
  subTitle,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <Layout title={layoutTitle}>
    <Card p={4} bgImage="url('/img/white-bg.jpg')" bgSize="cover">
      <Box
        px="38px"
        py="38px"
        borderWidth={40}
        borderColor="seedclub.green.600"
        sx={{
          borderImage: "url('/img/grid-150x150.jpg')",
          borderImageSlice: "51 51",
          borderImageRepeat: "round",
        }}
      >
        <VStack spacing={8} textAlign="center">
          <VStack spacing={2}>
            {header}
            <Heading
              as="h1"
              fontFamily="display"
              fontWeight="normal"
              fontSize={{ base: "5xl", md: "6xl" }}
            >
              {title}
            </Heading>
            {subTitle}
          </VStack>
          {children}
        </VStack>
      </Box>
    </Card>
  </Layout>
)

export default PageContent
