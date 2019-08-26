<template>
  <div class="m-detail-list">
    <ul>
      <!--// 这里过滤的目的，是因为获取到的数据，有很多条目是不符合我们预期的，所以过滤一下，拿到想要的某几项数据-->
      <li>{{ list.filter(item=>item.photos.length).length }}款套餐</li>
      <item
        v-for="(item,idx) in list"
        :key="idx"
        :meta="item"
      />
    </ul>
  </div>
</template>

<script>
import Item from './item.vue'
export default {
  components: {
    Item
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>
