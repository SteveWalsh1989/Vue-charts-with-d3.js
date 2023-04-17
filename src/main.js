import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import mdiVue from 'mdi-vue/v3';
import * as mdijs from '@mdi/js';
import router from './router/index.js';

createApp(App)
  .use(mdiVue, {
    icons: mdijs,
  })
  .use(router)
  .mount('#app');
