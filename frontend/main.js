import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import './assets/style.css';
const pinia = createPinia();
import { modal } from '@/mixins/modal';
import Modal from '@/components/Modal/Modal.vue';
import vue3GoogleLogin from 'vue3-google-login';

const app = createApp(App);
import JsonExcel from 'vue-json-excel3';
app.use(router);
app.use(pinia);
app.use(vue3GoogleLogin, {
  clientId: '442748426844-mr0jd52vjd36u0m6472d19sfvo7i9l6d.apps.googleusercontent.com',
});
app.mount('#app');
app.component('Modal', Modal);
app.use(modal);
