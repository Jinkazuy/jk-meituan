<template>
  <div class="page-detail">
    <el-row>
      <el-col :span="24">
        <!--// 面包屑组件-->
        <crumbs
          :keyword="keyword"
          :type="type"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <!--// 产品信息组件-->
        <summa :meta="product" />
      </el-col>
    </el-row>
    <el-row class="m-title">
      <el-col :span="24">
        <h3>商家团购及优惠</h3>
      </el-col>
    </el-row>
    <!--// 登录情况下，就渲染优惠列表，这里使用v-if&v-else-->
    <el-row v-if="canOrder || !login">
      <el-col :span="24">
        <!--// 优惠列表-->
        <list
          v-if="login"
          :list="list"
        />
        <!--// 未登录情况下，渲染去登录的按钮-->
        <div
          v-else
          class="deal-need-login"
        >
          <img
            src="//p0.meituan.net/codeman/56a7d5abcb5ce3d90fc91195e5b5856911194.png"
            alt="登录查看"
          >
          <span>请登录后查看详细团购优惠</span>
          <!--// 登录按钮-->
          <el-button
            type="primary"
            round
          >
            <a href="/login">立即登录</a>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 面包屑组件
import Crumbs from '../components/detail/crumbs.vue'
// 产品信息组件
import Summa from '../components/detail/summary.vue'
// 优惠列表
import List from '../components/detail/list.vue'
export default {
  components: {
    Crumbs,
    Summa,
    List
  },
  computed: {
    canOrder () {
      // 判断拿到的优惠列表的数据，是否满足设计要求，可以用优惠列表的每一项的图片进行判断
      // 如果拿到的数据的图片都没有，那么就认为没有可购买的内容
      return this.list.filter(item => item.photos.length).length
    }
  },
  // 在nuxt.js的asyncData声明周期中，可以拿到上下文
  async asyncData (ctx) {
    const { keyword, type } = ctx.query
    // 拿到商品关键词和类型，然后请求商品详情页数据
    const { status, data: { product, more: list, login } } = await ctx.$axios.get('/search/products', {
      params: {
        keyword,
        type,
        city: ctx.store.state.geo.position.city
      }
    })
    if (status === 200) {
      // 因为asyncData声明周期无法使用this，所以这里return数据，那么this.data就能接收到这些数据
      return {
        keyword,
        product,
        type,
        list,
        login
      }
    } else {
      // 如果请求失败就返回空数据
      return {
        keyword,
        product: {},
        type,
        list: [],
        login: false
      }
    }
  }
}
</script>

<style lang="scss">
  @import "../assets/css/detail/index.scss";
</style>
