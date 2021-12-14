import { Center } from "@chakra-ui/react"
import Jazzicon from "@metamask/jazzicon"
import { useEffect, useRef } from "react"

type Props = {
  address: string
  size?: number
}

const Identicon = ({ address, size = 40 }: Props): JSX.Element => {
  const ref = useRef<HTMLDivElement>()

  useEffect(() => {
    if (address && ref.current) {
      ref.current.innerHTML = ""
      ref.current.appendChild(Jazzicon(size, parseInt(address.slice(2, 10), 16)))
    }
  }, [address, size])

  return (
    <Center
      boxSize="3.25rem"
      maxW="3.25rem"
      maxH="3.25rem"
      overflow="hidden"
      rounded="full"
      ref={ref}
    />
  )
}

export default Identicon
