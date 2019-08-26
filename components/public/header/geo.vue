<template>
  <div class="m-geo">
    <!--// 使用饿了么的icon类名-->
    <!--// 这里直接调用vuex下的-->
    <i class="el-icon-location">{{ $store.state.geo.position.city }}</i>
    <!--// 这里的nuxt-link相当于vue的router-link-->
    <nuxt-link
      class="changeCity"
      to="/changeCity"
    >
      切换城市
    </nuxt-link>
    <!--// 这里的推荐的城市，写什么都行-->
    [香河 廊坊 天津]
  </div>
</template>

<script>
export default {
}
</script>

<style lang="css">
</style>
