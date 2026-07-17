import { createRouter, createWebHashHistory } from 'vue-router'

// 路由规则
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    name: 'main',
    component: () => import('@/views/Main.vue'),
    redirect: '/home',
    children: [
      // 子路由通过 store.addMenu() 动态添加
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
