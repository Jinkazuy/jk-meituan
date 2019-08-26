<!--// 商品结果列表-->
<template>
  <div class="m-products-list">
    <!--// 排序tab，这里没做排序功能-->
    <dl>
      <dd
        v-for="item in nav"
        :key="item.name"
        :class="[item.name,item.acitve?'s-nav-active':'']"
        @click="navSelect(item.name)"
      >
        {{ item.txt }}
      </dd>
    </dl>
    <!--// 搜索结果列表，将数据传入商品卡片组件-->
    <ul>
      <Item
        v-for="(item,idx) in list"
        :key="idx"
        :meta="item"
      />
    </ul>
  </div>
</template>

<script>
// 商品列表组件
import Item from './product.vue'
export default {
  components: {
    Item
  },
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  // 筛选tab
  data () {
    return {
      nav: [
        {
          name: 's-default',
          txt: '智能排序',
          acitve: true
        }, {
          name: 's-price',
          txt: '价格最低',
          active: false
        }, {
          name: 's-visit',
          txt: '人气最高',
          active: false
        }, {
          name: 's-comment',
          txt: '评价最高',
          active: false
        }
      ]
    }
  },
  // 在nuxt.js 中的 asyncData生命周期函数中可以拿到vue实例
  // 下方这个函数只是演示，没有实际用途；
  // async asyncData ({ app }) {
  //   // 这个app就是vue实例
  //   const { data } = await app.$axios.get('searchList')
  //   // 拿到搜索结果数据，必须用return的方式返回，此时this.下就有了这个items的属性
  //   return { items: data.list }
  // },
  methods: {
    navSelect (item) {
      // 没做，这里应该对this.list赋值给临时变量，然后进行排序，将排序后的数组再进行循环
      console.log(item)
    }
  }
}
</script>
