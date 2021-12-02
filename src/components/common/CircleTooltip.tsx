import { Tooltip, TooltipProps } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

const CircleTooltip = ({
  children,
  ...props
}: PropsWithChildren<TooltipProps>): JSX.Element => (
  <Tooltip
    {...props}
    px={6}
    py={16}
    bgColor="seedclub.white"
    rounded="full"
    color="black"
    textAlign="center"
    fontSize="xl"
    fontWeight="light"
    alignItems="center"
    bgImage="url('/img/white-bg.jpg')"
    bgSize="cover"
  >
    {children}
  </Tooltip>
)

export default CircleTooltip
