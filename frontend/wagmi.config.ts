import { http, createConfig } from '@wagmi/vue'
import { base, mainnet, sepolia } from '@wagmi/vue/chains'
import { injected, metaMask, safe } from '@wagmi/vue/connectors'

export const config = createConfig({
  chains: [mainnet, base, sepolia],
  connectors: [
    injected(),
    metaMask(),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
})