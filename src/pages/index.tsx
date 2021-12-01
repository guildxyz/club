import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Link,
  Text,
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
import useTokenDataWithImage from "hooks/useTokenDataWithImage"
import useWindowSize from "hooks/useWindowSize"
import lottie from "lottie-web"
import { useEffect, useMemo, useRef, useState } from "react"
import Confetti from "react-confetti"
import coins from "static/lotties/coins.json"
import { mutate } from "swr"

const AirdropPage = (): JSX.Element => {
  const { width, height } = useWindowSize()
  const [runConfetti, setRunConfetti] = useState(false)

  const { active, account, chainId } = useWeb3React()
  const eligible = useMemo(
    () => Object.keys(MerkleDistributor.claims).includes(account),
    [account]
  )
  const {
    data: [isClaimed, token, distributionEnd, owner],
  } = useMerkleDistributor()
  const { tokenSymbol } = useTokenDataWithImage(token)

  const ended = useMemo(
    () =>
      distributionEnd
        ? +formatUnits(distributionEnd, 0) < Math.round(new Date().getTime() / 1000)
        : true,
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
        lottie.loadAnimation({
          container: document.querySelector("#coins-animation"),
          animationData: coins,
          loop: false,
        })
      }, 200)

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
      layoutTitle={
        (tokenSymbol &&
          (isClaimed ? `$${tokenSymbol} Claimed!` : `Claim Your $${tokenSymbol}`)) ||
        "Loading..."
      }
      title={
        (tokenSymbol &&
          (isClaimed ? `$${tokenSymbol} Claimed!` : `Claim Your $${tokenSymbol}`)) ||
        "Loading..."
      }
    >
      {tokenSymbol && (
        <>
          <VStack spacing={6} fontSize="xl" py={8}>
            {isClaimed ? (
              <>
                <Text fontSize="xl">
                  <Link href="" target="_blank" textDecoration="underline">
                    Read this post
                  </Link>{" "}
                  to learn more about what's next.
                </Text>
                <Text>It's time to build.</Text>
              </>
            ) : (
              <>
                {!ended && eligible && (
                  <>
                    <Text mb={4}>Congrats!</Text>
                    <Text>
                      {`You'll receive ${tokenSymbol} for being an early participant in our community.`}
                    </Text>
                    <Text>
                      <Link href="" target="_blank" textDecoration="underline">
                        Read this post
                      </Link>{" "}
                      to learn more about what's next.
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
                px={8}
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

          {isClaimed && owner?.toLowerCase() !== account?.toLowerCase() && (
            <LinkButton href="https://discord.gg/42UjJskuEF" colorScheme="seedclub">
              Open SeedClub Discord
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
            <AlertDialogHeader fontSize="3xl" fontWeight="bold">
              Congrats!
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text mb={4}>You've successfully claimed your tokens!</Text>
              <Box id="coins-animation" mx="auto" boxSize={56} />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button colorScheme="seedclub" ref={cancelRef} onClick={onClose}>
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
