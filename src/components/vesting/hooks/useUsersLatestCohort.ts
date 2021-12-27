import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"

// Fetch a specific cohort's data
const fetchUsersLatestCohort = (_: string, account: string) =>
  fetch(`${process.env.NEXT_PUBLIC_API}/cohort-ids/${account}`)
    .then((res) => res.json())
    .then((data) =>
      Array.isArray(data?.cohortIds)
        ? data.cohortIds[data.cohortIds.length - 1]
        : null
    )
    .catch((_) => null)

const useUsersLatestCohort = () => {
  const { account } = useWeb3React()

  return useSWR<string>(
    account ? ["usersLatestCohort", account] : null,
    fetchUsersLatestCohort,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  )
}

export default useUsersLatestCohort
