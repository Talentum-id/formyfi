import { VueQueryPlugin } from '@tanstack/vue-query';
import { WagmiPlugin } from '@wagmi/vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { config } from './wagmi.config';

import App from './App.vue';
import router from './router';
import './assets/style.css';
const pinia = createPinia();
import { modal } from '@/mixins/modal';
import Modal from '@/components/Modal/Modal.vue';
import vue3GoogleLogin from 'vue3-google-login';

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(vue3GoogleLogin, {
  clientId: process.env.CLIENT_ID,
});
app.use(WagmiPlugin, { config })
app.use(VueQueryPlugin, {})
app.mount('#app');
app.component('Modal', Modal);
app.use(modal);
