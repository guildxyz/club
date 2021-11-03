import { Logger } from "@ethersproject/logger"

const parseError = (err: any): string => {
  if (Object.values(Logger.errors).includes(err.code))
    return err.toString().split("(")[0]

  return err?.message
}

export default parseError
