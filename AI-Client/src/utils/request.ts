import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000
})
// 请求拦截器
request.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  
  return config
}, (error) => {
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use((response) => {
  return response.data
})

export default request