import { Heading, Text, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import { PropsWithChildren } from "react"
import JoinCommunity from "./JoinCommunity"

type Props = {
  header?: JSX.Element
  layoutTitle: string
  title: string | JSX.Element
  subTitle?: string
}

const PageContent = ({
  header,
  layoutTitle,
  title,
  subTitle,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <Layout title={layoutTitle}>
    <Card p={8} fontFamily="display">
      <VStack spacing={8} fontWeight="semibold" textAlign="center">
        <VStack spacing={2}>
          {header}
          <Heading
            as="h1"
            fontFamily="display"
            fontSize={{ base: "4xl", md: "5xl" }}
          >
            {title}
          </Heading>
          {subTitle && <Text colorScheme="gray">{subTitle}</Text>}
        </VStack>
        {children}
        <JoinCommunity />
      </VStack>
    </Card>
  </Layout>
)

export default PageContent
