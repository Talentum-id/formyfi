import { VueQueryPlugin } from '@tanstack/vue-query';
import { WagmiPlugin } from '@wagmi/vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { config } from './wagmi.config';
import SolanaWallets from 'solana-wallets-vue';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import App from './App.vue';
import router from './router';
import './assets/style.css';
import 'solana-wallets-vue/styles.css';
import { modal } from '@/mixins/modal';
import Modal from '@/components/Modal/Modal.vue';
import vue3GoogleLogin from 'vue3-google-login';

const pinia = createPinia();
const app = createApp(App);
const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
  ],
  autoConnect: false,
};

app.use(router);
app.use(pinia);
app.use(vue3GoogleLogin, {
  clientId: process.env.CLIENT_ID,
});
app.use(WagmiPlugin, { config });
app.use(VueQueryPlugin, {});
app.use(SolanaWallets, walletOptions);
app.mount('#app');
app.component('Modal', Modal);
app.use(modal);
