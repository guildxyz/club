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
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import PageContent from "components/common/PageContent"
import TokenImage from "components/common/TokenImage"
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
    isValidating: isMerkleDistributorLoading,
    data: [isClaimed, token, distributionEnd, owner],
  } = useMerkleDistributor()
  const {
    isLoading: isTokenValidating,
    tokenSymbol,
    tokenImage,
  } = useTokenDataWithImage(token)

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
      layoutTitle="CLUBdrop"
      title="CLUBdrop"
      header={
        account &&
        !isMerkleDistributorLoading &&
        (tokenImage || tokenSymbol) && (
          <TokenImage
            isLoading={isTokenValidating}
            tokenSymbol={tokenSymbol}
            tokenImage={tokenImage}
          />
        )
      }
    >
      {account && !tokenSymbol && (
        <>
          {isMerkleDistributorLoading ? (
            <Spinner mx="auto" />
          ) : (
            <Text fontSize="lg">Could not fetch reward token.</Text>
          )}
        </>
      )}

      {account && tokenSymbol && (
        <>
          <VStack spacing={1} fontSize="xl" pb={4}>
            {isClaimed ? (
              <Text fontSize="xl">You've already claimed your tokens!</Text>
            ) : (
              <>
                {!ended && eligible && (
                  <>
                    <Text>
                      {`Congrats! You've qualified to receive ${tokenSymbol}.`}
                    </Text>
                    <Text>
                      Read{" "}
                      <Link href="" target="_blank" color="seedclub.green.700">
                        this post
                      </Link>{" "}
                      to learn more about what's next.
                    </Text>
                  </>
                )}

                {!ended && !eligible && (
                  <>
                    <Text>Sorry! You didn't qualify for the CLUBDrop.</Text>
                    <Text>
                      Read{" "}
                      <Link href="" target="_blank" color="seedclub.green.700">
                        this post
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

          {!ended && eligible && owner?.toLowerCase() !== account?.toLowerCase() && (
            <Button
              px={8}
              letterSpacing="wide"
              colorScheme="seedclub"
              isDisabled={isClaimed}
              isLoading={isClaimLoading}
              loadingText="Claiming"
              onClick={onClaimSubmit}
            >
              Claim
            </Button>
          )}
        </>
      )}

      {!account && (
        <Text fontSize="xl">Please connect your wallet in order to continue!</Text>
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
              <Button
                colorScheme="seedclub"
                ref={cancelRef}
                onClick={onClose}
                fontFamily="display"
              >
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
