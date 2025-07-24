import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './style.css'

import VueGtag from 'vue-gtag-next'

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(VueGtag, {
  property: {
    id: 'G-PJ396EXSTX'
  }
})

app.mount('#app')
