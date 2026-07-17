<template>
  <div class="user-page">
    <!-- 头部区域 -->
    <div class="user-header">
      <el-button type="primary" @click="handleAdd">+ 新增</el-button>
      <el-form :inline="true" :model="formInline">
        <el-form-item label="">
          <el-input v-model="formInline.keyword" placeholder="请输入姓名搜索" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <div class="table">
      <el-table :data="list" style="width: 100%; height: 500px">
        <el-table-column
          v-for="item in tableLabel"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :width="item.width ? item.width : 125"
        />
        <el-table-column fixed="right" label="操作" min-width="180">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        size="small"
        background
        layout="prev, pager, next"
        :total="config.total"
        @current-change="changePage"
        class="pager"
      />
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="action == 'add' ? '新增用户' : '编辑用户'"
      width="35%"
      :before-close="handleClose"
    >
      <el-form :inline="true" :model="formUser" :rules="rules" ref="userForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formUser.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item class="select-clearn" label="性别" prop="sex">
              <el-select v-model="formUser.sex" placeholder="请选择性别">
                <el-option label="男" value="1" />
                <el-option label="女" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birth">
              <el-date-picker
                v-model="formUser.birth"
                type="date"
                placeholder="请选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="地址" prop="addr">
            <el-input v-model="formUser.addr" placeholder="请输入地址" />
          </el-form-item>
        </el-row>
        <el-row style="justify-content: flex-end">
          <el-form-item>
            <el-button type="primary" @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="onSubmit">确定</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus"

const { proxy } = getCurrentInstance()

// 搜索表单
const formInline = reactive({
  keyword: "",
})

// 用户列表
const list = ref([])

// 表格列配置
const tableLabel = reactive([
  { prop: "name", label: "姓名" },
  { prop: "age", label: "年龄" },
  { prop: "sexLabel", label: "性别" },
  { prop: "birth", label: "出生日期", width: 200 },
  { prop: "addr", label: "地址", width: 400 },
])

// 分页配置
const config = reactive({
  total: 0,
  page: 1,
  name: "",
})

// 弹窗状态
const dialogVisible = ref(false)
const action = ref("add")

// 用户表单
const formUser = reactive({})

// 表单验证规则
const rules = reactive({
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  age: [
    { required: true, message: "请输入年龄", trigger: "blur" },
    { type: "number", message: "年龄必须为数字" },
  ],
  sex: [{ required: true, message: "请选择性别", trigger: "change" }],
  birth: [{ required: true, message: "请选择出生日期" }],
  addr: [{ required: true, message: "请输入地址" }],
})

// 时间格式化
const timeFormat = (time) => {
  var time = new Date(time)
  var year = time.getFullYear()
  var month = time.getMonth() + 1
  var date = time.getDate()
  function add(m) {
    return m < 10 ? "0" + m : m
  }
  return year + "-" + add(month) + "-" + add(date)
}

// 获取用户数据
const getUserData = async () => {
  const data = await proxy.$api.getUserData({
    name: config.name,
    page: config.page,
  })
  // 处理性别显示
  list.value = data.data.list.map(item => ({
    ...item,
    sexLabel: item.sex === 1 ? '男' : '女'
  }))
  config.total = data.data.count
}

// 搜索
const handleSearch = () => {
  config.name = formInline.keyword
  config.page = 1
  getUserData()
}

// 分页切换
const changePage = (page) => {
  config.page = page
  getUserData()
}

// 新增用户
const handleAdd = () => {
  action.value = "add"
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (val) => {
  action.value = "edit"
  dialogVisible.value = true
  nextTick(() => {
    // 将 sex 转为字符串以匹配 el-option value
    Object.assign(formUser, { ...val, sex: "" + val.sex })
  })
}

// 删除用户
const handleDelete = (val) => {
  ElMessageBox.confirm("确定删除该用户吗？").then(async () => {
    await proxy.$api.deleteUser({ id: val.id })
    ElMessage({
      showClose: true,
      message: "删除成功",
      type: "success",
    })
    getUserData()
  })
}

// 关闭弹窗
const handleClose = () => {
  proxy.$refs["userForm"].resetFields()
  dialogVisible.value = false
}

// 取消
const handleCancel = () => {
  proxy.$refs["userForm"].resetFields()
  dialogVisible.value = false
}

// 提交表单
const onSubmit = () => {
  proxy.$refs["userForm"].validate(async (valid) => {
    if (valid) {
      let res = null
      // 格式化日期
      formUser.birth = /^\d{4}-\d{2}-\d{2}$/.test(formUser.birth)
        ? formUser.birth
        : timeFormat(formUser.birth)

      if (action.value == "add") {
        res = await proxy.$api.addUser(formUser)
      } else if (action.value == "edit") {
        res = await proxy.$api.editUser(formUser)
      }

      if (res) {
        dialogVisible.value = false
        proxy.$refs["userForm"].resetFields()
        getUserData()
        ElMessage({
          showClose: true,
          message: action.value == "add" ? "添加成功" : "编辑成功",
          type: "success",
        })
      }
    } else {
      ElMessage({
        showClose: true,
        message: "请完善表单信息",
        type: "error",
      })
    }
  })
}

onMounted(() => {
  getUserData()
})
</script>

<style lang="less" scoped>
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.table {
  position: relative;
  height: 520px;
  .pager {
    position: absolute;
    right: 10px;
    bottom: 30px;
  }
  .el-table {
    width: 100%;
    height: 500px;
  }
}
.select-clearn {
  display: flex;
}
</style>
