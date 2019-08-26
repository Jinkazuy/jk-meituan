// ***************
// 后端页面入口文件
// ***************

// 引入koa
import Koa from 'koa'

// 引入mongoose，用来操作MongoDB更加方便
import mongoose from 'mongoose'

// koa没有封装解析post请求的代码，所以单独引入，用来解析post请求的请求体
import bodyParser from 'koa-bodyparser'

// 处理session的第三方包
import session from 'koa-generic-session'

// 用来处理临时session的数据库
import Redis from 'koa-redis'

// 引入编译成json格式化的第三方包
import json from 'koa-json'

// 导入数据库配置文件
import dbConfig from './dbs/config'

// 导入用于验证用户信息的文件
import passport from './interface/utils/passport'

// 导入处理用户注册、登录、退出登录、获取用户信息的router处理函数
import users from './interface/users'
// 城市、地理位置router
import geo from './interface/geo'
import search from './interface/search'
import categroy from './interface/categroy'
import cart from './interface/cart'

// xxx
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

// 实例化koa
const app = new Koa()

// 设置监听IP地址
const host = process.env.HOST || '127.0.0.1'

// 设置监听端口
const port = process.env.PORT || 3000

// 配置session相关的内容，键值对，可以随便写，其实是用于加密的
app.keys = ['mt', 'keyskeys']
// 这里这样写，教程没说为什么，也是跟session有关；
app.proxy = true
// 配置session的一些参数
app.use(session({ key: 'mt', prefix: 'mt:uid', store: new Redis() }))

// 挂载解析请求体的包
app.use(bodyParser({
  extendTypes: ['json', 'form', 'text']
}))
// 挂载json包
app.use(json())

// 连接数据库
mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true
})

// 挂载处理登录注册的第三包
app.use(passport.initialize())
app.use(passport.session())

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // 挂载各种路由
  // 登录注册router
  app.use(users.routes()).use(users.allowedMethods())
  // 城市、地理位置router
  app.use(geo.routes()).use(geo.allowedMethods())
  // 搜索相关的路由
  app.use(search.routes()).use(search.allowedMethods())
  app.use(categroy.routes()).use(categroy.allowedMethods())
  app.use(cart.routes()).use(cart.allowedMethods())
  app.use((ctx) => {
    ctx.status = 200 // koa defaults to 404 when it sees that status is unset

    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, (promise) => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject)
      })
    })
  })

  // 监听端口
  app.listen(port, host)
  consola.ready({ message: `Server listening on http://${host}:${port}`, badge: true })
}

start()
