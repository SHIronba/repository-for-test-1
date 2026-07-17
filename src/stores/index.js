import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

// 初始状态
function initState() {
  return {
    menuList: [],
    token: "",
    // tags 默认包含首页
    tags: [
      {
        path: '/home',
        name: 'home',
        label: '首页',
        icon: 'home'
      }
    ],
    routeList: [],
    currentMenu: null
  }
}

export const useAllDataStore = defineStore('allData', () => {
  const state = ref(initState())

  // 更新菜单列表
  function updateMenuList(val) {
    state.value.menuList = val
  }

  // 选择菜单 —— 更新 tags 和 currentMenu
  function selectMenu(val) {
    if (val.name == 'home') {
      state.value.currentMenu = null
    } else {
      state.value.currentMenu = val
      // 判断 tag 是否已存在
      let index = state.value.tags.findIndex(item => item.name === val.name)
      // 不存在则加入 tags
      index === -1 ? state.value.tags.push(val) : ""
    }
  }

  // 移除 tag
  function updateTags(tag) {
    let index = state.value.tags.findIndex(item => item.name === tag.name)
    state.value.tags.splice(index, 1)
  }

  // 动态添加路由
  function addMenu(router, type) {
    // 如果是 refresh 类型（页面刷新恢复）
    if (type === "refresh") {
      // 从 localStorage 恢复 state
      if (JSON.parse(localStorage.getItem('store'))) {
        state.value = JSON.parse(localStorage.getItem('store'))
        // 清空 routeList（重新挂载路由）
        state.value.routeList = []
      } else {
        return
      }
    }

    const menu = state.value.menuList
    // 动态导入 views 目录下所有 .vue 文件
    const module = import.meta.glob('../views/**/*.vue')
    const routeArr = []

    menu.forEach(item => {
      if (item.children) {
        // 如果有子菜单，处理 children
        item.children.forEach(val => {
          let url = `../views/${val.url}.vue`
          val.component = module[url]
        })
        routeArr.push(...item.children)
      } else {
        let url = `../views/${item.url}.vue`
        item.component = module[url]
        routeArr.push(item)
      }
    })

    // 添加路由到 main 路由下
    routeArr.forEach(item => {
      state.value.routeList.push(router.addRoute("main", item))
    })
  }

  // 退出登录 —— 清理所有状态和路由
  function clearn() {
    // 移除动态路由
    state.value.routeList.forEach(item => {
      if (item) item()
    })
    // 重置 state
    state.value = initState()
    // 清除 localStorage
    localStorage.removeItem('store')
  }

  // 监听 state 变化，持久化到 localStorage（排除 routeList）
  watch(state, (newObj) => {
    if (!newObj.token) return
    localStorage.setItem('store', JSON.stringify(newObj))
  }, { deep: true })

  return {
    state,
    updateMenuList,
    selectMenu,
    updateTags,
    addMenu,
    clearn
  }
})
