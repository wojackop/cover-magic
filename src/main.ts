import { createApp } from 'vue'
import '@/assets/css/main.css'
import App from './App.vue'
import { createHead } from '@unhead/vue/client';

// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'

const app = createApp(App)
// 使用 createHead 创建 head 管理器并挂载到 Vue 应用上

const head = createHead()
app.use(head);

app.mount('#app')
