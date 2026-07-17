<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <!-- 用户信息卡片 -->
      <el-card shadow="hover">
        <div class="user">
          <img :src="getImageUrl('user')" class="user-img" />
          <div class="user-info">
            <p class="name">Admin</p>
            <p class="role">超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登录时间：<span>2022-7-11</span></p>
          <p>上次登录地点：<span>上海</span></p>
        </div>
      </el-card>

      <!-- 商品表格 -->
      <el-card shadow="hover" class="table">
        <el-table :data="tableData">
          <el-table-column
            v-for="(val, key) in tableLabel"
            :key="key"
            :prop="key"
            :label="val"
          >
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>

    <!-- 右侧数据区域 -->
    <el-col :span="16" style="margin-top: 20px">
      <!-- 统计卡片 -->
      <div class="num">
        <el-card
          v-for="item in countData"
          :key="item.name"
          shadow="hover"
        >
          <div style="display: flex; align-items: center">
            <div
              class="icons"
              :style="{ background: item.color }"
            >
              <component :is="item.icon"></component>
            </div>
            <div class="detail">
              <p class="num-val">¥{{ item.value }}</p>
              <p class="txt">{{ item.name }}</p>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 折线图 -->
      <el-card shadow="hover" class="top-echart">
        <div ref="echart" style="height: 280px"></div>
      </el-card>

      <!-- 柱状图和饼图 -->
      <div class="graph">
        <el-card shadow="hover">
          <div ref="userEchart" style="height: 240px"></div>
        </el-card>
        <el-card shadow="hover">
          <div ref="videoEchart" style="height: 240px"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance, onBeforeUnmount } from 'vue'
import * as echarts from "echarts"
import { getImageUrl } from '@/utils'

const { proxy } = getCurrentInstance()

// 表格数据
const tableData = ref([])

const tableLabel = ref({
  name: "品牌",
  todayBuy: "今日购买",
  monthBuy: "本月购买",
  totalBuy: "总计购买",
})

// 统计数据
const countData = ref([])

// ResizeObserver
const observer = ref(null)

// 折线图配置
const xOptions = reactive({
  textStyle: {
    color: "#333",
  },
  legend: {},
  grid: {
    left: "20%",
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: [],
    axisLine: {
      lineStyle: {
        color: "#17b3a3",
      },
    },
    axisLabel: {
      interval: 0,
      color: "#333",
    },
  },
  yAxis: [
    {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#17b3a3",
        },
      },
    },
  ],
  color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
  series: [],
})

// 饼图配置
const pieOptions = reactive({
  tooltip: {
    trigger: "item",
  },
  legend: {},
  color: [
    "#0f78f4",
    "#dd536b",
    "#9462e5",
    "#a6a6a6",
    "#e1bb22",
    "#39c362",
    "#3ed1cf",
  ],
  series: []
})

// 获取表格数据
const getTableData = async () => {
  const data = await proxy.$api.getTableData()
  tableData.value = data.data.tableData
}

// 获取统计数据
const getCountData = async () => {
  const data = await proxy.$api.getCountData()
  countData.value = data.data
}

// 获取图表数据
const getChartData = async () => {
  const { data } = await proxy.$api.getChartData()
  const { orderData, userData, videoData } = data

  // 折线图 —— orderData
  xOptions.xAxis.data = orderData.date
  xOptions.series = Object.keys(orderData.data[0]).map(val => ({
    name: val,
    data: orderData.data.map(item => item[val]),
    type: "line"
  }))

  const OneEcharts = echarts.init(proxy.$refs["echart"])
  OneEcharts.setOption(xOptions)

  // 柱状图 —— userData
  xOptions.xAxis.data = userData.map((item) => item.date)
  xOptions.series = [
    {
      name: "新增用户",
      data: userData.map((item) => item.new),
      type: "bar",
    },
    {
      name: "活跃用户",
      data: userData.map((item) => item.active),
      type: "bar",
    }
  ]
  const TwoEcharts = echarts.init(proxy.$refs["userEchart"])
  TwoEcharts.setOption(xOptions)

  // 饼图 —— videoData
  pieOptions.series = [
    {
      data: videoData,
      type: "pie",
    },
  ]
  const ThreeEcharts = echarts.init(proxy.$refs["videoEchart"])
  ThreeEcharts.setOption(pieOptions)

  // ResizeObserver 监听容器变化
  observer.value = new ResizeObserver(() => {
    OneEcharts.resize()
    TwoEcharts.resize()
    ThreeEcharts.resize()
  })

  if (proxy.$refs["echart"]) {
    observer.value.observe(proxy.$refs["echart"])
  }
}

onMounted(() => {
  getTableData()
  getCountData()
  getChartData()
})

onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  overflow: hidden;
  .user {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
    padding-bottom: 20px;
    .user-img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 40px;
    }
    .user-info {
      .name {
        font-size: 32px;
        margin-bottom: 10px;
      }
      .role {
        color: #999;
      }
    }
  }
  .login-info {
    p {
      line-height: 30px;
      font-size: 14px;
      color: #999;
      span {
        color: #666;
        margin-left: 60px;
      }
    }
  }
  .table {
    margin-top: 20px;
  }
  .num {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-card {
      width: 32%;
      margin-bottom: 20px;
    }
    .icons {
      width: 80px;
      height: 80px;
      font-size: 30px;
      text-align: center;
      line-height: 80px;
      color: #fff;
    }
    .detail {
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .num-val {
        font-size: 30px;
        margin-bottom: 10px;
      }
      .txt {
        font-size: 14px;
        text-align: center;
        color: #999;
      }
    }
  }
  .top-echart {
    height: 280px;
  }
  .graph {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .el-card {
      width: 48%;
      height: 260px;
    }
  }
}
</style>
