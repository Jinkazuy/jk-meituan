// ***************
// 封装一个发送ajax请求的函数，因为不能直接使用axios，需要配置一些前置内容；
// ***************
import axios from 'axios'

// 创建一个实例
const instance = axios.create({
  // 基础url，这里设置了之后，那么在发送请求的时候，直接调用这个实例，
  // 就不用再写http://xx.com了，而是直接写.com后边的URL路径即可；
  // 如果在调用这个实例的时候，传入的URL路径不是http://xx.xx.com这种形式的话，
  // 那么就会自动用下边的baseURL补全前面的域名；
  baseURL: `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`,
  // 超时设置，单位是毫秒
  timeout: 2333,
  // 设置公共头部内容，如果没有就设置为空
  headers: {}
})

export default instance
