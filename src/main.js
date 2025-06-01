import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vue3Lottie from 'vue3-lottie'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(Vue3Lottie, { name: 'LottieAnimation' })
app.mount('#app')
