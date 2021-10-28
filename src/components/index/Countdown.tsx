import { Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"

type Props = {
  timestamp: number
  endText: string
}

const Countdown = ({ timestamp, endText }: Props): JSX.Element => {
  const [remainingTime, setRemainingTime] = useState("00:00:00:00")

  const counting = () => {
    const now = new Date().getTime()
    const timeleft = new Date(timestamp * 1000).getTime() - now

    const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeleft % (1000 * 60)) / 1000)

    setRemainingTime(
      `${hours < 10 ? `0${hours}` : hours}:${
        minutes < 10 ? `0${minutes}` : minutes
      }:${seconds < 10 ? `0${seconds}` : seconds}`
    )
  }

  useEffect(() => {
    const interval = setInterval(counting, 1000)

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [])

  if (remainingTime === "")
    return (
      <Text color="red.500" fontSize="2xl">
        {endText}
      </Text>
    )

  return <Text fontSize="4xl">{remainingTime}</Text>
}

export default Countdown
