import useSWR from "swr"

// Fetch a specific cohort's data
const fetchCohort = (_: string, cohortId: string) =>
  fetch(`${process.env.NEXT_PUBLIC_API}/cohort/${cohortId}`)
    .then((res) => res.json())
    .catch((_) => null)

const useCohort = (cohortId: string) =>
  useSWR<{
    status: string
    merkleRoot: string
    distributionEnd: string
    vestingEnd: string
    vestingPeriod: string
    cliffPeriod: string
  }>(cohortId ? ["cohort", cohortId] : null, fetchCohort, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  })

export default useCohort
