import Router from 'koa-router'
// import Poi from '../dbs/models/poi'
import axios from './utils/axios'
// 这个本来使用签名验证的，后来老师取消了验证，所以就不用这个sign文件了
// import sign from './utils/sign'

const router = new Router({ prefix: '/search' })

// 实时获取用户输入的搜索词汇的 关联词汇、搜索建议，由前台发送ajax请求
router.get('/top', async (ctx) => {
  // try {
  //   let top = await Poi.find({
  //     'name': new RegExp(ctx.query.input),
  //     city: ctx.query.city
  //   })
  //   ctx.body = {
  //     code: 0,
  //     top: top.map(item => {
  //       return {
  //         name: item.name,
  //         type: item.type
  //       }
  //     }),
  //     type: top.length ? top[0].type : ''
  //   }
  // } catch (e) {
  //   ctx.body = {
  //     code: -1,
  //     top: []
  //   }
  // }
  const { status, data: {
    top
  } } = await axios.get(`http://cp-tools.cn/search/top`, {
    params: {
      input: ctx.query.input,
      city: ctx.query.city
    }
  })
  ctx.body = {
    top: status === 200
      ? top
      : []
  }
})

// 获取热搜关键词
router.get('/hotPlace', async (ctx) => {
  // let city = ctx.store ? ctx.store.geo.position.city : ctx.query.city
  // try {
  //   let result = await Poi.find({
  //     city,
  //     type: ctx.query.type || '景点'
  //   }).limit(10)
  //
  //   ctx.body = {
  //     code: 0,
  //     result: result.map(item => {
  //       return {
  //         name: item.name,
  //         type: item.type
  //       }
  //     })
  //   }
  // } catch (e) {
  //   ctx.body = {
  //     code: -1,
  //     result: []
  //   }
  // }
  const city = ctx.store
    ? ctx.store.geo.position.city
    : ctx.query.city
  const { status, data: {
    result
  } } = await axios.get(`http://cp-tools.cn/search/hotPlace`, {
    params: {
      // sign,
      city
    }
  })
  ctx.body = {
    result: status === 200
      ? result
      : []
  }
})

// 首页FEED商品列表数据
router.get('/resultsByKeywords', async (ctx) => {
  const { city, keyword } = ctx.query
  const {
    status,
    data: {
      count,
      pois
    }
  } = await axios.get('http://cp-tools.cn/search/resultsByKeywords', {
    params: {
      city,
      keyword
    }
  })
  ctx.body = {
    count: status === 200 ? count : 0,
    pois: status === 200
      ? pois
      : []
  }
})

// 获取商品详情页数据
router.get('/products', async (ctx) => {
  // 这里避免请求体出现空数据，所以默认了一些文字；
  const keyword = ctx.query.keyword || '旅游'
  const city = ctx.query.city || '北京'
  const {
    status,
    data: {
      product,
      more
    }
  } = await axios.get('http://cp-tools.cn/search/products', {
    params: {
      keyword,
      city
    }
  })
  if (status === 200) {
    ctx.body = {
      product,
      // 这个isAuthenticated是用来判断是否登录了，这个API是 Passport提供的
      // 如果登录了，就返回商品优惠套餐信息，如果是未登录就返回空数据；
      more: ctx.isAuthenticated() ? more : [],
      login: ctx.isAuthenticated()
    }
  } else {
    // 请求失败也要返回响应数据，否则前台文件会报错；
    ctx.body = {
      product: {},
      more: ctx.isAuthenticated() ? more : [],
      login: ctx.isAuthenticated()
    }
  }
})

export default router
