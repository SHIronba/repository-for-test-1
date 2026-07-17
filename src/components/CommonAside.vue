<template>
  <el-menu
    :default-active="activeMenu"
    class="el-menu-vertical"
    :collapse="isCollapse"
    router
  >
    <!-- 无子菜单的项 -->
    <template v-for="item in noChildren" :key="item.name">
      <el-menu-item
        :index="item.path"
        @click="clickMenu(item)"
      >
        <component class="icons" :is="item.icon"></component>
        <span>{{ item.label }}</span>
      </el-menu-item>
    </template>

    <!-- 有子菜单的项 -->
    <template v-for="item in hasChildren" :key="item.label">
      <el-sub-menu :index="item.label">
        <template #title>
          <component class="icons" :is="item.icon"></component>
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item
          v-for="child in item.children"
          :key="child.name"
          :index="child.path"
          @click="clickMenu(child)"
        >
          <component class="icons" :is="child.icon"></component>
          <span>{{ child.label }}</span>
        </el-menu-item>
      </el-sub-menu>
    </template>
  </el-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAllDataStore } from '@/stores'

const store = useAllDataStore()
const route = useRoute()

// 从 store 获取菜单列表
const list = computed(() => store.state.menuList)

// 当前激活菜单
const activeMenu = computed(() => route.path)

// 接收父组件传递的折叠状态
defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  }
})

const noChildren = computed(() => list.value.filter(item => !item.children))
const hasChildren = computed(() => list.value.filter(item => item.children))

const clickMenu = (item) => {
  store.selectMenu(item)
}
</script>

<style lang="less" scoped>
.icons {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
