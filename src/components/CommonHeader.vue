<template>
  <div class="header">
    <div class="l-content">
      <!-- 折叠按钮 -->
      <el-button size="small" @click="handleCollapse">
        <component class="icons" is="menu"></component>
      </el-button>

      <!-- 面包屑 -->
      <el-breadcrumb separator="/" class="bread">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="current" :to="current.path">
          {{ current.label }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 右侧用户信息 -->
    <div class="r-content">
      <el-dropdown>
        <span>
          <img :src="getImageUrl('user')" class="user" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLoginOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAllDataStore } from '@/stores'
import { getImageUrl } from '@/utils'

const store = useAllDataStore()
const router = useRouter()

const current = computed(() => store.state.currentMenu)

const emit = defineEmits(['toggleCollapse'])

const handleCollapse = () => {
  emit('toggleCollapse')
}

const handleLoginOut = () => {
  store.clearn()
  router.push("/login")
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #333;
}
.icons {
  width: 20px;
  height: 20px;
}
.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
.l-content {
  display: flex;
  align-items: center;
  .el-button {
    margin-right: 20px;
  }
}
:deep(.bread span) {
  color: #fff !important;
  cursor: pointer !important;
}
</style>
