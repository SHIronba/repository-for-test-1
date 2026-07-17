<template>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside width="auto">
      <common-aside :is-collapse="isCollapse" />
    </el-aside>
    <el-container>
      <!-- 头部 -->
      <el-header>
        <common-header @toggle-collapse="handleToggle" />
      </el-header>
      <!-- 标签栏 -->
      <common-tab />
      <!-- 主体区域 -->
      <el-main class="right-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { CommonAside, CommonHeader, CommonTab } from "@/components"

const isCollapse = ref(false)

const handleToggle = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style lang="less" scoped>
.el-header {
  padding: 0;
  height: 60px;
}
.el-aside {
  height: 100vh;
  background-color: #545c64;
}
.el-container {
  height: 100%;
}
.right-main {
  height: calc(100% - 100px);
  overflow: auto;
}
</style>
