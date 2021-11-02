import { Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"

type Props = {
  timestamp: number
  endText: string
  long?: boolean
  onEnd?: () => void
}

const Countdown = ({ timestamp, endText, long, onEnd }: Props): JSX.Element => {
  const [remainingTime, setRemainingTime] = useState("00:00:00:00")
  const [shouldCount, setShouldCount] = useState(true)

  const counting = () => {
    const now = new Date().getTime()
    const timeleft = new Date(timestamp * 1000).getTime() - now

    if (timeleft < 0) setShouldCount(false)

    const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeleft % (1000 * 60)) / 1000)

    setRemainingTime(
      long
        ? `${hours} hours ${minutes} minutes ${seconds} seconds`
        : `${hours < 10 ? `0${hours}` : hours}:${
            minutes < 10 ? `0${minutes}` : minutes
          }:${seconds < 10 ? `0${seconds}` : seconds}`
    )
  }

  useEffect(() => {
    const interval = shouldCount ? setInterval(counting, 1000) : null
    if (!shouldCount) {
      if (typeof onEnd === "function") onEnd()
      if (interval) clearInterval(interval)
      setRemainingTime("")
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [shouldCount])

  if (remainingTime === "")
    return (
      <Text color="red.500" fontSize="2xl">
        {endText}
      </Text>
    )

  return <Text fontSize={long ? "xl" : "4xl"}>{remainingTime}</Text>
}

export default Countdown
