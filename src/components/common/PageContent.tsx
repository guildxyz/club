import { Box, Heading, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import { PropsWithChildren } from "react"
import { Rest } from "types"

type Props = {
  header?: JSX.Element
  layoutTitle: string
  title: string | JSX.Element
  subTitle?: JSX.Element
} & Rest

const PageContent = ({
  header,
  layoutTitle,
  title,
  subTitle,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => (
  <Layout title={layoutTitle}>
    <Card
      p={3}
      bgImage="url('/img/white-bg.jpg')"
      bgSize="cover"
      fontSize={{ base: "0.8rem", sm: "1.5rem" }}
    >
      <Box
        px={{ base: "0.5rem", sm: "1.875rem" }}
        py={{ base: "1rem", sm: "1.875rem" }}
        borderWidth={{ base: "1.25rem", sm: "2rem" }}
        borderColor="seedclub.green.600"
        sx={{
          borderImage: "url('/img/grid-150x150.jpg')",
          borderImageSlice: "51 51",
          borderImageRepeat: "round",
        }}
      >
        <VStack spacing={{ base: 6, sm: 10 }} textAlign="center" {...rest}>
          <VStack spacing={2}>
            {header}
            <Heading
              as="h1"
              fontWeight="thin"
              fontSize={{ base: "2.5rem", sm: "4.5rem" }}
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
