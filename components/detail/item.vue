<template>
  <li
    v-if="meta.photos.length"
    class="m-detail-item"
  >
    <dl class="section">
      <dd>
        <img
          :src="meta.photos[0].url"
          :alt="meta.photos[0].title"
        >
      </dd>
      <dd>
        <h4>{{ meta.name }}</h4>
        <p>
          <span v-if="meta.biz_ext&&meta.biz_ext.ticket_ordering">剩余：{{ Number(meta.biz_ext.ticket_ordering) }}</span>
          <span v-if="meta.deadline">截止日期：{{ meta.deadline }}</span>
        </p>
        <p>
          <span class="price">{{ Number(meta.biz_ext.cost) }}</span>
          <sub>门店价{{ Number(meta.biz_ext.cost) }}</sub>
        </p>
      </dd>
      <dd>
        <el-button
          type="warning"
          round
          @click="createCart"
        >
          立即抢购
        </el-button>
      </dd>
    </dl>
  </li>
</template>

<script>
export default {
  props: {
    meta: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    // 创建购物车
    async createCart () {
      const self = this
      const {
        status,
        data: {
          code,
          id
        }
      } = await this.$axios.post('/cart/create', {
        params: {
          // id，商品id，这里随机数编了一个
          id: Math.random().toString().slice(3, 9),
          // 商品详情数据
          detail: {
            name: self.meta.name,
            price: self.meta.biz_ext.cost,
            imgs: self.meta.photos
          }
        }
      })
      // 如果创建购物车成功了，那么就跳转到购物车页，并且把购物车id传过去
      // 购物车详情页拿到购物车id，发送请求获取购物车详情数据；
      if (status === 200 && code === 0) {
        window.location.href = `/cart/?id=${id}`
      } else {
        console.log('error')
      }
    }
  }
}
</script>

<style lang="scss">

</style>
