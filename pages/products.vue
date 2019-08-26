<!--// 商品搜索结果列表-->
<template>
  <el-row class="page-product">
    <el-col :span="19">
      <!--// 面包屑组件-->
      <crumbs :keyword="keyword" />
      <!--// 分类组件-->
      <categroy
        :types="types"
        :areas="areas"
      />
      <!--// 商品结果列表组件-->
      <list :list="list" />
    </el-col>
    <!--// 地图组件在右侧，而且是单独占5栏栅格-->
    <el-col :span="5">
      <!--// 地图组件-->
      <!--如果没有经纬度就不显示这个组件，否则会报错-->
      <amap
        v-if="point.length"
        :width="230"
        :height="290"
        :point="point"
      />
    </el-col>
  </el-row>
</template>

<script>
// 面包屑组件
import Crumbs from '../components/products/crumbs.vue'
// 分类组件
import Categroy from '../components/products/categroy.vue'
// 商品结果列表组件
import List from '../components/products/list.vue'
// 地图组件
import Amap from '../components/public/map.vue'
export default {
  components: {
    Crumbs,
    Categroy,
    List,
    Amap
  },
  data () {
    return {
      list: [],
      types: [],
      areas: [],
      keyword: '',
      point: []
    }
  },
  // 在nuxt.js的asyncData生命周期函数，可以拿到请求的上下文，也就是可以拿到请求体
  // asyncData方法会在组件（限于页面组件）每次加载之前被调用。它可以在服务端或路由更新之前被调用。
  // 在这个方法被调用的时候，第一个参数被设定为当前页面的上下文对象，你可以利用 asyncData方法来获取数据并返回给当前组件，SSR。
  // 由于asyncData方法是在组件 初始化 前被调用的，所以在方法内是没有办法通过 this 来引用组件的实例对象。

  // 也就是在服务端运行时处理这些请求，然后拿到数据，再传给各个子组件进行渲染，达到SSR效果；
  async asyncData (ctx) {
    // 拿到get请求的请求体 ，搜索关键词
    // 这个keyword就是点击搜索结果，跳转到搜索结果页时 a标签里包含的值，那么这里可以通过ctx拿到；
    const keyword = ctx.query.keyword
    // 获取当前城市
    const city = ctx.store.state.geo.position.city
    // 获取搜索关键词对应的搜索结果数据
    const { status, data: { count, pois } } = await ctx.$axios.get('/search/resultsByKeywords', {
      params: {
        keyword,
        city
      }
    })
    // 获取城区分类
    const { status: status2, data: { areas, types } } = await ctx.$axios.get('/categroy/crumbs', {
      params: {
        city
      }
    })
    // 最后进行统一的判断
    if (status === 200 && count > 0 && status2 === 200) {
      // 这个return的就能够赋值给vue实例this下的data
      return {
        list: pois.filter(item => item.photos.length).map((item) => {
          return {
            type: item.type,
            img: item.photos[0].url,
            name: item.name,
            comment: Math.floor(Math.random() * 10000),
            rate: Number(item.biz_ext.rating),
            price: Number(item.biz_ext.cost),
            scene: item.tag,
            tel: item.tel,
            status: '可订明日',
            location: item.location,
            module: item.type.split(';')[0]
          }
        }),
        keyword,
        areas: areas.filter(item => item.type !== '').slice(0, 5),
        types: types.filter(item => item.type !== '').slice(0, 5),
        point: (pois.find(item => item.location).location || '').split(',')
      }
    }
  }
}
</script>

<style lang="scss">
  @import "../assets/css/products/index.scss";
</style>
