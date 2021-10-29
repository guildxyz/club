import addresses from "./addresses"

const dev = {
  TEMP_INCENTIVEKEY: {
    rewardToken: addresses.REWARD_TOKEN_ADDRESS,
    pool: addresses.POOL_ADDRESS,
    startTime: 1635498024, // Math.ceil(+new Date() / 1000 + 120), // TODO: should be a fixed date and we should store it
    endTime: 1635584424, // Math.ceil(+new Date() / 1000 + 120 + 24 * 60 * 60), // TODO: should be a fixed date and we should store it
  },
}

export default dev
