// ***************
// 用于验证用户信息的文件
// ***************

// koa-passport是koa的一个中间件，它实际上只是对passport的一个封装。
// 利用koa-passport可以简便的实现登录注册功能
import passport from 'koa-passport'

// passport.js是Nodejs中的一个做登录验证的中间件，极其灵活和模块化，
// 并且可与Express、Sails、koa等Web框架无缝集成。
// Passport功能单一，即只能做登录验证，但非常强大，
// 支持本地账号验证和第三方账号登录验证（OAuth和OpenID等），支持大多数Web网站和服务。
import LocalStrategy from 'passport-local'

// 引入mongoDB用户数据模型
import UserModel from '../../dbs/models/users'

// 第一个参数 是一个函数，这个函数中，又有三个参数，1用户名，2密码，3回调函数
passport.use(new LocalStrategy(async function (username, password, done) {
  // 设置查询条件
  const where = {
    username
  }
  // 在mongoDB数据库中找到该用户
  const result = await UserModel.findOne(where)
  // 判断，如果结果不为null，说明找到了结果
  if (result != null) {
    // 那么再进行判断，如果密码对了，就将该用户在数据库中的数据返回
    if (result.password === password) {
      return done(null, result)
    } else {
      // 如果密码错了，就返回字符串
      return done(null, false, '密码错误')
    }
  } else {
    // 没有找到该用户，也返回字符串
    return done(null, false, '用户不存在')
  }
}))

// 在用户每次登陆都储存到session中，就做一个序列化的动作
passport.serializeUser(function (user, done) {
  done(null, user)
})
// 反序列化
passport.deserializeUser(function (user, done) {
  return done(null, user)
})

export default passport
