import addresses from "./addresses"

const dev = {
  INCENTIVEKEY: {
    rewardToken: addresses.REWARD_TOKEN_ADDRESS,
    pool: addresses.POOL_ADDRESS,
    startTime: 1635842638, // Math.ceil(+new Date() / 1000 + 120), // TODO: should be a fixed date and we should store it
    endTime: 1635929038, // Math.ceil(+new Date() / 1000 + 120 + 24 * 60 * 60), // TODO: should be a fixed date and we should store it
    refundee: "0x2893b7e6E8a5aF81d262024a550a3159b1F65217",
  },
  REWARD_TOKEN_ADDRESS: "0x3c65d35a8190294d39013287b246117ebf6615bd",
  TOKEN0_ADDRESS: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  TOKEN1_ADDRESS: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
}

export default dev
