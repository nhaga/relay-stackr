import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, base, baseSepolia, optimism } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, sepolia, base, baseSepolia, optimism],
  transports: {
    // [mainnet.id]: http("https://eth.llamarpc.com"),
    [sepolia.id]: http("https://ethereum-sepolia-rpc.publicnode.com"),
    // [base.id]: http("https://base-mainnet.g.alchemy.com/v2/yhJNxT8iIfwZakQSFbWTGDh__Jlx_f86"),
    // [baseSepolia.id]: http("https://base-sepolia.g.alchemy.com/v2/yhJNxT8iIfwZakQSFbWTGDh__Jlx_f86"),
    // [optimism.id]: http("https://opt-mainnet.g.alchemy.com/v2/yhJNxT8iIfwZakQSFbWTGDh__Jlx_f86"),

  },
})