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
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import LinkButton from "components/common/LinkButton"
import PageContent from "components/common/PageContent"
import useClaim from "components/index/hooks/useClaim"
import useMerkleDistributor from "components/index/hooks/useMerkleDistributor"
import useWithdraw from "components/index/hooks/useWithdraw"
import useWithdrawAmount from "components/index/hooks/useWithdrawAmount"
import MerkleDistributor from "constants/MerkleDistributor"
import useTokenData from "hooks/useTokenData"
import useWindowSize from "hooks/useWindowSize"
import { useEffect, useMemo, useRef, useState } from "react"
import Confetti from "react-confetti"
import { mutate } from "swr"

const AirdropPage = (): JSX.Element => {
  const { width, height } = useWindowSize()
  const [runConfetti, setRunConfetti] = useState(false)
  const buttonSize = useBreakpointValue({ base: "md", sm: "xl" })

  const { active, account, chainId } = useWeb3React()
  const eligible = useMemo(
    () => Object.keys(MerkleDistributor.claims).includes(account),
    [account]
  )
  const {
    data: [isClaimed, token, distributionEnd, owner],
  } = useMerkleDistributor()
  const {
    data: [, tokenSymbol],
  } = useTokenData(token)

  const userMerkleData = useMemo(() => MerkleDistributor.claims[account], [account])

  const ended = useMemo(
    () =>
      distributionEnd &&
      +formatUnits(distributionEnd, 0) < Math.round(new Date().getTime() / 1000),
    [distributionEnd]
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
    if (withdrawResponse) mutate(active ? ["merkle", chainId, account] : null)
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
          ? (tokenSymbol &&
              (isClaimed
                ? `${parseInt(
                    formatUnits(userMerkleData?.amount)
                  )} $${tokenSymbol} Claimed!`
                : `Claim Your $${tokenSymbol}`)) ||
            "Loading..."
          : "Seed Club"
      }
    >
      {tokenSymbol && (
        <>
          <VStack spacing={6} pt={8} pb={16}>
            {isClaimed ? (
              <>
                <Text>
                  Welcome to Seed Club!{" "}
                  <Link href="" target="_blank" textDecoration="underline">
                    Read this post
                  </Link>{" "}
                  to learn more about what's next.
                </Text>
                <Text pb={12}>
                  You can also now vote in our DAO 20 Awards to help us admit top
                  talent into our DAO.
                </Text>
                <LinkButton
                  href="https://airtable.com/shrk8N2DBl7q87jn5"
                  colorScheme="seedclub"
                  size={buttonSize}
                >
                  Vote on DAO 20 Awards
                </LinkButton>
              </>
            ) : (
              <>
                {!ended && eligible && (
                  <>
                    <Text mb={{ base: 0, sm: 4 }}>Congrats!</Text>
                    <Text>
                      {`You're eligible for ${formatUnits(
                        userMerkleData?.amount
                      )} $${tokenSymbol} for being a value-added member of the Seed Club community.`}
                    </Text>
                    <Text>
                      <Link href="" target="_blank" textDecoration="underline">
                        Read this post
                      </Link>{" "}
                      to learn more.
                    </Text>
                  </>
                )}

                {!ended && !eligible && (
                  <>
                    <Text>Shoot, this address isn't eligible for the airdrop.</Text>

                    <Text>
                      <Link href="" target="_blank" textDecoration="underline">
                        Read this post
                      </Link>{" "}
                      to learn why and how to get involved moving forward.
                    </Text>
                  </>
                )}

                {ended && <Text>Sorry! Claiming period has ended.</Text>}
              </>
            )}
          </VStack>

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

          {eligible &&
            !isClaimed &&
            owner?.toLowerCase() !== account?.toLowerCase() && (
              <Button
                size={buttonSize}
                px={16}
                letterSpacing="wide"
                colorScheme="seedclub"
                isDisabled={ended}
                isLoading={isClaimLoading}
                loadingText="Claiming"
                onClick={onClaimSubmit}
              >
                Claim
              </Button>
            )}

          {false && isClaimed && owner?.toLowerCase() !== account?.toLowerCase() && (
            <LinkButton
              size={buttonSize}
              href="https://discord.gg/42UjJskuEF"
              colorScheme="seedclub"
            >
              Join Seed Club Discord
            </LinkButton>
          )}
        </>
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
              <Text mb={4}>You've successfully claimed your CLUBDrop!</Text>
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

export default AirdropPage
