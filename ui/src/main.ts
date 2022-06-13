import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { plugin, defaultConfig} from '@formkit/vue'
import easySpinner from 'vue-easy-spinner';
import '@formkit/themes/genesis'
import './index.css'

import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';


import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(plugin, defaultConfig)
app.use(easySpinner, {prefix: 'easy'});
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-');
app.use(VueToast);

app.mount('#app')
