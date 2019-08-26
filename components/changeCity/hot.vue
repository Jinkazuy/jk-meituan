<!--// *******************-->
<!--// 热门城市组件-->
<!--// *******************-->
<template>
  <div class="m-hcity">
    <dl>
      <dt>热门城市：</dt>
      <dd
        v-for="item in list"
        :key="item.id"
      >
        <!--// 判断请求到的数据的每一条的name属性是否是'市辖区'，这个是后台规定的数据结构，判断一下即可-->
        {{ item.name==='市辖区'?item.province:item.name }}
      </dd>
    </dl>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 热门城市列表
      list: []
    }
  },
  async mounted () {
    // 在mounted钩子时，获取热门城市列表数据
    const { status, data: { hots } } = await this.$axios.get('/geo/hotCity')
    if (status === 200) {
      this.list = hots
      console.log(hots)
    }
  }
}
</script>

<style lang="scss">
  @import "../../assets/css/changeCity/hot.scss";
</style>
