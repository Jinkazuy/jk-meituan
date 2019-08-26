import Router from 'koa-router'

// 操作本地数据库，因为这个文件中用的都是第三方数据接口与，所以没有操作本地数据库
// 所以操作本地数据库的API都注释了，所以这里也要注释；
// import Province from '../dbs/models/province'

// 导入自己配置好的axios文件；
import axios from './utils/axios'

// 实例化router，并且加前缀
const router = new Router({ prefix: '/geo' })

// 这里是签名，但是老师后来把签名验证取消了，所以这里有没有都行，
// 如果这里注释了，那么后边的所有请求的URL路径也得把?sign=${sign}删掉
const sign = 'abcd'

// 路由
// 根据ip地址，获取当前用户所在城市
// 这里用的是老师自己写的第三方的接口，所以要把http路径写全；
// 那么这个借口是在vuex中请求的，nuxt.js的vuex里可以使用 nuxtServerInit 声明周期函数
// 使用这个声明周期函数，会在服务端执行，
// 也就是在服务端编译的时候，vuex发送ajax请求，获取用户当前位置，然后存储到vuex中
// 然后前台页面用到vuex的数据也会变化，而不是等到前台拿到页面后再发送ajax请求了；
router.get('/getPosition', async (ctx) => {
  // 解构赋值，将接口返回的内容拿到
  const {
    status,
    data: {
      province,
      city
    }
  } = await axios.get(`http://cp-tools.cn/geo/getPosition?sign=${sign}`)
  // 判断，如果接口返回数据成功，那么就直接返回给前台，否则返回空数据
  if (status === 200) {
    ctx.body = {
      province,
      city
    }
  } else {
    ctx.body = {
      province: '',
      city: ''
    }
  }
})

// 路由，
// 获取省份信息
router.get('/province', async (ctx) => {
  // 操作本地数据库的方法；
  // 如果用本地数据库的话，就要把下方第三方的方法注释掉，
  // 而且别忘了导入MongoDB的数据；
  // let province = await Province.find()
  // ctx.body = {
  //   province: province.map(item => {
  //     return {
  //       id: item.id,
  //       name: item.value[0]
  //     }
  //   })
  // }

  // 使用第三方接口/数据库的方法
  const { status, data: {
    province
  } } = await axios.get(`http://cp-tools.cn/geo/province?sign=${sign}`)
  ctx.body = {
    province: status === 200
      ? province
      : []
  }
})

// 路由
// 根据id获取省份信息
router.get('/province/:id', async (ctx) => {
  // 操作本地数据库的方法；
  // let city = await City.findOne({id: ctx.params.id})
  //
  // ctx.body = {
  //   code: 0,
  //   city: city.value.map(item => {
  //     return {province: item.province, id: item.id, name: item.name}
  //   })
  // }

  // 使用第三方接口/数据库的方法
  const { status, data: {
    city
  } } = await axios.get(`http://cp-tools.cn/geo/province/${ctx.params.id}?sign=${sign}`)
  if (status === 200) {
    ctx.body = {
      city
    }
  } else {
    ctx.body = {
      city: []
    }
  }
})

// 路由
// 获取城市信息
router.get('/city', async (ctx) => {
  // 操作本地数据库的方法；
  // let city = []
  // let result = await City.find()
  // result.forEach(item => {
  //   city = city.concat(item.value)
  // })
  // ctx.body = {
  //   code: 0,
  //   city: city.map(item => {
  //     return {
  //       province: item.province,
  //       id: item.id,
  //       name: item.name === '市辖区' || item.name === '省直辖县级行政区划'
  //         ? item.province
  //         : item.name
  //     }
  //   })
  // }

  // 使用第三方接口/数据库的方法
  const { status, data: {
    city
  } } = await axios.get(`http://cp-tools.cn/geo/city?sign=${sign}`)
  if (status === 200) {
    ctx.body = {
      city
    }
  } else {
    ctx.body = {
      city: []
    }
  }
})

// 路由
// 获取热门城市
router.get('/hotCity', async (ctx) => {
  // 操作本地数据库的方法；
  // let list = [
  //   '北京市',
  //   '上海市',
  //   '广州市',
  //   '深圳市',
  //   '天津市',
  //   '西安市',
  //   '杭州市',
  //   '南京市',
  //   '武汉市',
  //   '成都市'
  // ]
  // let result = await City.find()
  // let nList = []
  // result.forEach(item => {
  //   nList = nList.concat(item.value.filter(k => list.includes(k.name) || list.includes(k.province)))
  // })
  // ctx.body = {
  //   hots: nList
  // }

  // 使用第三方接口/数据库的方法
  const { status, data: {
    hots
  } } = await axios.get(`http://cp-tools.cn/geo/hotCity?sign=${sign}`)
  if (status === 200) {
    ctx.body = {
      hots
    }
  } else {
    ctx.body = {
      hots: []
    }
  }
})

// 路由
// 获取首页左侧菜单，也就是一级导航分类的数据
router.get('/menu', async (ctx) => {
  // 操作本地数据库的方法；
  // const result = await Menu.findOne()
  // ctx.body = {
  //   menu: result.menu
  // }

  // 使用第三方接口/数据库的方法
  const { status, data: {
    menu
  } } = await axios.get(`http://cp-tools.cn/geo/menu?sign=${sign}`)
  if (status === 200) {
    ctx.body = {
      menu
    }
  } else {
    ctx.body = {
      menu: []
    }
  }
})

// 导出路由
export default router
