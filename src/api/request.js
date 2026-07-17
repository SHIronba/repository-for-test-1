import axios from 'axios'

const service = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 可从 store 获取 token 添加
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { data } = response
    // 可根据 code 做统一处理
    return data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default service
