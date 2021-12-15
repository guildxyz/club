import { Button } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import PageContent from "components/common/PageContent"
import useCreateCohort from "components/vesting/useCreateCohort"

const VestingPage = (): JSX.Element => {
  const { active, account, chainId } = useWeb3React()
  const { isLoading, onSubmit } = useCreateCohort()

  return (
    <PageContent layoutTitle="Vesting" title="Vesting">
      YOLO
      <Button
        onClick={() =>
          onSubmit({
            input: {
              "0x2893b7e6E8a5aF81d262024a550a3159b1F65217": "56BC75E2D63100000",
            },
          })
        }
      >
        Create cohort
      </Button>
    </PageContent>
  )
}

export default VestingPage
