import { http, createConfig } from '@wagmi/vue'
import { base, mainnet } from '@wagmi/vue/chains'
import { coinbaseWallet, metaMask } from '@wagmi/vue/connectors'

export const config = createConfig({
  chains: [mainnet, base],
  connectors: [
    coinbaseWallet(),
    metaMask(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
})