import Router from 'koa-router'
import md5 from 'crypto-js/md5'
import Cart from '../dbs/models/cart'
// import axios from './utils/axios'

const router = new Router({ prefix: '/cart' })

// 创建购物车
router.post('/create', async (ctx) => {
  // 登录拦截，isAuthenticated这个API是 Passport提供的
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      // 没有登录
      code: -1,
      msg: 'please login'
    }
  } else {
    // 已经登录
    // 创建日期
    const time = Date()
    // 购物车id
    const cartNo = md5(Math.random() * 1000 + time).toString()
    // 拿到post请求中的商品id和商品详情
    const {
      params: {
        id,
        detail
      }
    } = ctx.request.body
    // 创建本地数据库的购物车实例，user信息用session第三方包就能拿到（koa-generic-session包）
    const cart = new Cart({ id, cartNo, time, user: ctx.session.passport.user, detail })
    // 持久化
    const result = await cart.save()
    // 判断，如果创建成功，就将该购物车数据返回给前台
    if (result) {
      ctx.body = {
        code: 0,
        msg: '',
        id: cartNo
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'fail'
      }
    }
  }
})

// 获取购物车信息
router.post('/getCart', async (ctx) => {
  // 拿到post请求中，当前购物车的id
  const { id } = ctx.request.body
  try {
    // 操作MongoDB数据，查找该购物车的信息
    const result = await Cart.findOne({ cartNo: id })
    // 查找到之后，将购物车数据返回给前台
    ctx.body = {
      code: 0,
      data: result
        ? result.detail[0]
        : {}
    }
  } catch (e) {
    ctx.body = {
      code: -1,
      data: {}
    }
  }
})

export default router
