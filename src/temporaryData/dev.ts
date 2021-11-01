import addresses from "./addresses"

const dev = {
  INCENTIVEKEY: {
    rewardToken: addresses.REWARD_TOKEN_ADDRESS,
    pool: addresses.POOL_ADDRESS,
    startTime: 1635670408, // Math.ceil(+new Date() / 1000 + 120), // TODO: should be a fixed date and we should store it
    endTime: 1635756808, // Math.ceil(+new Date() / 1000 + 120 + 24 * 60 * 60), // TODO: should be a fixed date and we should store it
    refundee: "0x2893b7e6E8a5aF81d262024a550a3159b1F65217",
  },
  REWARD_TOKEN_ADDRESS: "0x3c65d35a8190294d39013287b246117ebf6615bd",
}

export default dev
