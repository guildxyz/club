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
      p="0.5rem"
      bgImage="url('/img/white-bg.jpg')"
      bgSize="cover"
      fontSize={{ base: "0.8rem", sm: "1.5rem" }}
    >
      <Box
        px={{ base: "1.25rem", sm: "1.8rem" }}
        py={{ base: "1.25rem", sm: "1.8rem" }}
        bg="url('/img/pattern.png') 0 0 round"
        bgSize={{ base: "0.625rem 0.625rem", sm: "0.875rem 0.875rem" }}
      >
        <VStack
          spacing={{ base: 6, sm: 10 }}
          textAlign="center"
          bgImage="url('/img/white-bg.jpg')"
          {...rest}
        >
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
