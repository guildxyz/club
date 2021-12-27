import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Img,
  Link,
  SimpleGrid,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import PageContent from "components/common/PageContent"
import useClaim from "components/vesting/hooks/useClaim"
import useClaimableAmount from "components/vesting/hooks/useClaimableAmount"
import useClaimData from "components/vesting/hooks/useClaimData"
import useCohort from "components/vesting/hooks/useCohort"
import useCreateCohort from "components/vesting/hooks/useCreateCohort"
import useMerkleVesting from "components/vesting/hooks/useMerkleVesting"
import useUsersLatestCohort from "components/vesting/hooks/useUsersLatestCohort"
import useWithdraw from "components/vesting/hooks/useWithdraw"
import useWithdrawAmount from "components/vesting/hooks/useWithdrawAmount"
import useTokenData from "hooks/useTokenData"
import useWindowSize from "hooks/useWindowSize"
import { useEffect, useMemo, useRef, useState } from "react"
import Confetti from "react-confetti"
import { mutate } from "swr"

const VestingPage = (): JSX.Element => {
  const { width, height } = useWindowSize()
  const [runConfetti, setRunConfetti] = useState(false)
  const buttonSize = useBreakpointValue({ base: "md", sm: "xl" })
  const { active, account, chainId } = useWeb3React()
  const { onSubmit } = useCreateCohort()

  const {
    isValidating: isMerkleVestingLoading,
    data: [, token, owner],
  } = useMerkleVesting()

  const { isValidating: isUsersLatestCohortLoading, data: usersLatestCohort } =
    useUsersLatestCohort()

  const { isValidating: isCohortDetailsLoading, data: cohortDetails } =
    useCohort(usersLatestCohort)
  const { isValidating: isClaimDataLoading, data: claimData } =
    useClaimData(usersLatestCohort)
  const { isValidating: isClaimableAmountLoading, data: claimableAmount } =
    useClaimableAmount(usersLatestCohort, claimData?.amount)

  const claimableToday = useMemo(
    () => parseInt(formatUnits(claimableAmount || 0, 0)),
    [claimableAmount]
  )

  const {
    isValidating: isTokenSymbolLoading,
    data: [, tokenSymbol],
  } = useTokenData(token)

  const isLoading = useMemo(
    () =>
      isClaimDataLoading ||
      isUsersLatestCohortLoading ||
      isClaimableAmountLoading ||
      isCohortDetailsLoading ||
      isMerkleVestingLoading ||
      isTokenSymbolLoading,
    [
      isClaimDataLoading,
      isUsersLatestCohortLoading,
      isClaimableAmountLoading,
      isCohortDetailsLoading,
      isMerkleVestingLoading,
      isTokenSymbolLoading,
    ]
  )

  const ended = useMemo(
    () =>
      cohortDetails
        ? Math.round(new Date().getTime() / 1000) >=
          parseInt(cohortDetails.distributionEnd)
        : true,
    [cohortDetails]
  )

  const [showClaimSuccess, setShowClaimSuccess] = useState(false)
  const onClose = () => setShowClaimSuccess(false)
  const cancelRef = useRef()

  // Show confetti on successful claim
  useEffect(() => {
    if (showClaimSuccess) {
      setRunConfetti(true)

      setTimeout(() => {
        setRunConfetti(false)
      }, 5000)
      return
    }

    setRunConfetti(false)
  }, [showClaimSuccess])

  const {
    onSubmit: onClaimSubmit,
    isLoading: isClaimLoading,
    response: claimResponse,
  } = useClaim()

  useEffect(() => {
    if (claimResponse) setShowClaimSuccess(true)
  }, [claimResponse])

  const {
    onSubmit: onWithdrawSubmit,
    isLoading: isWithdrawLoading,
    response: withdrawResponse,
  } = useWithdraw()

  useEffect(() => {
    if (withdrawResponse) {
      mutate(active ? ["merkleVesting", chainId, account] : null)
      mutate(
        active
          ? [
              "claimableAmount",
              chainId,
              account,
              usersLatestCohort,
              claimData?.amount,
            ]
          : null
      )
    }
  }, [withdrawResponse])

  const { data: withdrawAmount } = useWithdrawAmount()
  const canWithdraw = useMemo(
    () => parseFloat(withdrawAmount) > 0,
    [withdrawAmount, withdrawResponse]
  )

  return (
    <PageContent
      px={{ base: 0, sm: 8 }}
      py={12}
      layoutTitle={
        account
          ? (tokenSymbol && `$${tokenSymbol} in Vesting`) || "Loading..."
          : "Seed Club"
      }
    >
      {!isLoading && claimData && cohortDetails && tokenSymbol && (
        <>
          <VStack spacing={6} px={2.5} py={8}>
            <Text>{`You have $${tokenSymbol} tokens subject to vesting. $${tokenSymbol} has a 6 month cliff and 3 year vesting term from the date they were earned.`}</Text>

            <VStack spacing={0} width="full">
              <SimpleGrid
                width="full"
                mb={{ base: 0.5, sm: 2 }}
                pt={8}
                gap={2}
                gridTemplateColumns={{ base: "70% 30%", sm: "65% 35%" }}
                fontSize={{ base: "1.25rem", sm: "2.25rem" }}
                fontFamily="heading"
                lineHeight={{ base: 2, sm: 1.5 }}
              >
                <Text as="span" width="full" textAlign="right">
                  Total tokens in vesting:
                </Text>
                <Text as="span" textAlign="left">{`${parseInt(
                  formatUnits(claimData?.amount || 0)
                )} $${tokenSymbol}`}</Text>
              </SimpleGrid>
              <SimpleGrid
                width="full"
                mb={{ base: 0.5, sm: 2 }}
                gap={2}
                gridTemplateColumns={{ base: "70% 30%", sm: "65% 35%" }}
                fontSize={{ base: "1.25rem", sm: "2.25rem" }}
                fontFamily="heading"
                lineHeight={{ base: 2, sm: 1.5 }}
              >
                <Text as="span" width="full" textAlign="right">
                  Claimable today:
                </Text>
                <Text as="span" textAlign="left">
                  {ended ? `0 $${tokenSymbol}` : `${claimableToday} $${tokenSymbol}`}
                </Text>
              </SimpleGrid>
            </VStack>

            <Button
              size={buttonSize}
              px={16}
              letterSpacing="wide"
              colorScheme="seedclub"
              isDisabled={ended || claimableToday === 0}
              isLoading={isClaimLoading}
              loadingText="Claiming"
              onClick={onClaimSubmit}
            >
              Claim
            </Button>

            {ended && owner && owner?.toLowerCase() === account?.toLowerCase() && (
              <Button
                size={buttonSize}
                px={8}
                letterSpacing="wide"
                colorScheme="seedclub"
                isDisabled={!canWithdraw}
                isLoading={isWithdrawLoading}
                loadingText="Withdraw"
                onClick={onWithdrawSubmit}
              >
                Withdraw unclaimed tokens
              </Button>
            )}
          </VStack>

          {process.env.NODE_ENV === "development" && (
            <Button
              onClick={() =>
                onSubmit({
                  input: {
                    address: "amount",
                  },
                })
              }
            >
              Create cohort
            </Button>
          )}
        </>
      )}

      {!claimData && !isLoading && (
        <Text>Shoot, this address isn't eligible for the vesting.</Text>
      )}

      <AlertDialog
        isOpen={showClaimSuccess}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="4xl" fontWeight="bold">
              Success!
            </AlertDialogHeader>

            <AlertDialogBody textAlign="center">
              <Text
                mb={4}
              >{`You've successfully claimed your $${tokenSymbol} tokens!`}</Text>
              <Text mb={4}>
                <Link
                  target="_blank"
                  href="https://discord.gg/42UjJskuEF"
                  textDecoration="underline"
                >
                  Head over to Discord
                </Link>{" "}
                to learn what's next!
              </Text>
              <Img mx="auto" w={32} src="/img/coins.png" />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button colorScheme="white" ref={cancelRef} onClick={onClose}>
                Ok
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
          <Confetti
            width={width}
            height={height}
            gravity={0.25}
            numberOfPieces={runConfetti ? 200 : 0}
          />
        </AlertDialogOverlay>
      </AlertDialog>
    </PageContent>
  )
}

export default VestingPage
