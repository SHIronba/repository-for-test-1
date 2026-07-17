import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/less/index.less'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import api from '@/api/api'
import { useAllDataStore } from '@/stores'
import '@/api/mock.js'

const app = createApp(App)
const pinia = createPinia()

app.use(ElementPlus)
// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 全局挂载 $api
app.config.globalProperties.$api = api

app.use(pinia)

// 在 use(pinia) 之后才能使用 store
// use(router) 之前需要先准备好 store 以便路由守卫使用
const store = useAllDataStore()
store.addMenu(router, "refresh")

// 判断路由是否存在
function isRoute(to) {
  return router.getRoutes().filter(item => item.path === to.path).length > 0
}

// 全局路由守卫
router.beforeEach((to, from) => {
  // 不是登录页且无 token → 跳转登录
  if (to.path !== '/login' && !store.state.token) {
    return { name: 'login' }
  }
  // 路由不存在 → 跳转 404
  if (!isRoute(to)) {
    return { name: '404' }
  }
})

app.use(router).mount('#app')
