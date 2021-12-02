import { Tooltip, TooltipProps } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

const CircleTooltip = ({
  children,
  ...props
}: PropsWithChildren<TooltipProps>): JSX.Element => (
  <Tooltip
    {...props}
    p={6}
    bgColor="seedclub.white"
    rounded="full"
    color="black"
    textAlign="center"
    fontSize="xl"
    fontWeight="light"
    bgImage="url('/img/white-bg.jpg')"
    bgSize="cover"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    {children}
  </Tooltip>
)

export default CircleTooltip
