<template>
  <el-form :model="loginForm" class="login-container">
    <h3>系统登录</h3>

    <el-form-item>
      <el-input
        type="input"
        placeholder="请输入账号"
        v-model="loginForm.username"
        :prefix-icon="User"
      >
      </el-input>
    </el-form-item>

    <el-form-item>
      <el-input
        type="password"
        placeholder="请输入密码"
        v-model="loginForm.password"
        :prefix-icon="Lock"
        show-password
      >
      </el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="login" style="width: 100%">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useAllDataStore } from '@/stores'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance()
const router = useRouter()
const store = useAllDataStore()

const loginForm = reactive({
  username: 'admin',
  password: 'admin',
})

const login = async () => {
  const res = await proxy.$api.getMenu(loginForm)
  if (res && res.code === 200) {
    // 更新菜单列表
    store.updateMenuList(res.data.menuList)
    // 存储 token
    store.state.token = res.data.token
    // 动态添加路由
    store.addMenu(router)
    router.push("/home")
  } else {
    // 登录失败提示
    ElMessage({
      showClose: true,
      message: res.data.message || '登录失败',
      type: "error",
    })
  }
}
</script>

<style lang="less" scoped>
.login-container {
  width: 350px;
  background-color: #fff;
  border: 1px solid #eaeaea;
  border-radius: 15px;
  padding: 35px 35px 15px 35px;
  box-shadow: 0 0 25px #cacaca;
  margin: 180px auto;
  h3 {
    text-align: center;
    margin-bottom: 20px;
    color: #505450;
  }
  :deep(.el-form-item__content) {
    justify-content: center;
  }
}
</style>
