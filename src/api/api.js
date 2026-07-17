/**
 * API 接口
 */
import request from "./request"

export default {
  // 首页 - 获取表格数据
  getTableData() {
    return request({
      url: '/home/getTableData',
      method: 'get',
    })
  },
  // 首页 - 获取统计数据
  getCountData() {
    return request({
      url: '/home/getCountData',
      method: 'get',
    })
  },
  // 首页 - 获取图表数据
  getChartData() {
    return request({
      url: '/home/getChartData',
      method: 'get',
    })
  },
  // 用户 - 获取用户列表
  getUserData(params) {
    return request({
      url: '/user/getUserData',
      method: 'get',
      data: params
    })
  },
  // 用户 - 新增用户
  addUser(params) {
    return request({
      url: '/user/addUser',
      method: 'post',
      data: params
    })
  },
  // 用户 - 编辑用户
  editUser(params) {
    return request({
      url: '/user/editUser',
      method: 'post',
      data: params
    })
  },
  // 用户 - 删除用户
  deleteUser(params) {
    return request({
      url: '/user/deleteUser',
      method: 'get',
      data: params
    })
  },
  // 权限 - 获取菜单
  getMenu(params) {
    return request({
      url: '/permission/getMenu',
      method: 'post',
      data: params
    })
  }
}
