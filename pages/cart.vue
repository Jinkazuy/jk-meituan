<template>
  <div class="page-cart">
    <el-row>
      <!--// 购物车商品列表-->
      <el-col
        v-if="cart.length"
        :span="24"
        class="m-cart"
      >
        <!--// 如果购物车数据有长度，那么就渲染购物车商品列表组件-->
        <list :cart-data="cart" />
        <p>
          应付金额：<em class="money">￥{{ total }}</em>
        </p>
        <div class="post">
          <el-button
            type="primary"
            @click="submit"
          >
            提交订单
          </el-button>
        </div>
      </el-col>
      <!--// 如果购物车商品数据为空，那么就展示为空的提示-->
      <el-col
        v-else
        class="empty"
      >
        购物车为空
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 购物车 商品列表组件
import List from '../components/cart/list.vue'
export default {
  components: {
    List
  },
  data () {
    return {
      cart: []
    }
  },
  computed: {
    // 计算购物车总价
    total () {
      let total = 0
      this.cart.forEach((item) => {
        total += item.price * item.count
      })
      return total
    }
  },
  // 在服务端运行时拿到购物车的数据
  async asyncData (ctx) {
    // 跳转到购物车详情页的时候，URL路径中就有该购物车的id
    // 将购物车id发送给这个接口，就能够拿到购物车详情
    const { status, data: { code, data: { name, price } } } = await ctx.$axios.post('/cart/getCart', {
      id: ctx.query.id
    })
    // 如果拿到了，那么就将数据返回给vue实例，那么vue下的data就能拿到数据了
    if (status === 200 && code === 0 && name) {
      return {
        cart: [{
          name,
          price,
          count: 1
        }],
        cartNo: ctx.query.id
      }
    }
  },
  methods: {
    // 提交订单提交订单，后台没写这个接口，这里就注释了先
    async submit () {
      await console.log('提交订单')
      // const { status, data: { code, id } } = await this.$axios.post('/order/createOrder', {
      //   count: this.cart[0].count,
      //   price: this.cart[0].price,
      //   id: this.cartNo
      // })
      // if (status === 200 && code === 0) {
      //   this.$alert(`恭喜您，已成功下单，订单号:${id}`, '下单成功', {
      //     confirmButtonText: '确定',
      //     callback: (action) => {
      //       location.href = '/order'
      //     }
      //   })
      // }
    }
  }

}
</script>

<style lang="scss">
  @import "../assets/css/cart/index.scss";
</style>
