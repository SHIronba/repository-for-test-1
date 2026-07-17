import Mock from 'mockjs'
import homeApi from './mockData/home'
import userApi from './mockData/user'
import permissionApi from './mockData/permission'

// 首页相关 mock
Mock.mock(/home\/getTableData/, "get", homeApi.getTableData)
Mock.mock(/home\/getCountData/, "get", homeApi.getCountData)
Mock.mock(/home\/getChartData/, "get", homeApi.getChartData)

// 用户相关 mock
Mock.mock(/user\/getUserData/, "get", userApi.getUserList)
Mock.mock(/user\/addUser/, "post", userApi.createUser)
Mock.mock(/user\/deleteUser/, "get", userApi.deleteUser)
Mock.mock(/user\/editUser/, "post", userApi.updateUser)

// 权限相关 mock
Mock.mock(/permission\/getMenu/, "post", permissionApi.getMenu)
