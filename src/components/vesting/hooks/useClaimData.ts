import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"

const fetchClaimData = (_: string, cohortId: string, address: string) =>
  fetch(`${process.env.NEXT_PUBLIC_API}/claim-data/${cohortId}/${address}`)
    .then((res) => res.json())
    .catch((_) => null)

const useClaimData = (cohortId: string) => {
  const { account } = useWeb3React()

  return useSWR<{
    index: number
    amount: string
    proof: Array<string>
  }>(
    cohortId && account ? ["usersCohortDetails", cohortId, account] : null,
    fetchClaimData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  )
}

export default useClaimData
