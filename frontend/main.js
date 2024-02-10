import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import './assets/style.css';
const pinia = createPinia();
import { modal } from '@/mixins/modal';
import Modal from '@/components/Modal/Modal.vue';

const app = createApp(App);
app.use(router);
app.use(pinia);

app.mount('#app');
app.component('Modal', Modal);
app.use(modal);
