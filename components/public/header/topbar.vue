<template>
  <!--// 这里用的是饿了么的UI框架，栅格布局-->
  <el-row
    :gutter="0"
    class="m-header"
  >
    <el-col :span="5">
      <geo />
    </el-col>
    <el-col :span="5">
      <user />
    </el-col>
    <el-col :span="14">
      <navbar />
    </el-col>
  </el-row>
</template>

<script>
// 引入城市组件
import Geo from './geo.vue'
// 引入用户登录注册组件
import User from './user.vue'
// 引入导航组件
import Navbar from './nav.vue'
export default {
  components: {
    Geo,
    User,
    Navbar
  }
}
</script>

<style lang="scss">
  @import "../../../assets/css/public/layout.scss";
  @import "../../../assets/css/public/header/index.scss";
</style>
