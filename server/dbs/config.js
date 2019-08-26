// ***************
// 数据库配置文件
// ***************

export default {
  // 数据库地址，真是开发中，如果不在本机上，那么就需要设置相应的IP地址
  // 设置MongoDB数据库地址（MongoDB的默认端口号是27017）
  dbs: 'mongodb://127.0.0.1:27017/student',
  // 设置Redis数据库地址
  redis: {
    get host () {
      // IP地址
      return '127.0.0.1'
    },
    get port () {
      // 端口号
      return 6379
    }
  },
  // smtp服务，也就是发送邮件服务，这里只能这么写，照写即可；
  // 这个smtp服务需要在qq邮箱的设置-账户中开启，然后就能在node.js或其他地方发送邮件了，
  // 如果不开启这个服务，只能在QQ邮箱里发送右键；
  smtp: {
    // host地址，只能写smtp.qq.com
    get host () {
      return 'smtp.qq.com'
    },
    // 发件邮箱
    get user () {
      return '632931267@qq.com'
    },
    // 授权码
    get pass () {
      return 'kxqjjnlbtmosbfja'
    },
    // 随机生成一个验证码
    get code () {
      return () => {
        return Math.random().toString(16).slice(2, 6).toUpperCase()
      }
    },
    // 验证码的过期时间，这里设置1分钟；
    get expire () {
      return () => {
        return new Date().getTime() + 60 * 60 * 1000
      }
    }
  }
}
