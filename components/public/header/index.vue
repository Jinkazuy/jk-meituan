<template>
  <div class="m-header">
    <el-row>
      <el-col>
        <!--// 最顶部的导航-->
        <top-bar />
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <!--// 包括搜索栏的bar-->
        <search-bar />
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 引入顶部导航与搜索栏
import topBar from './topbar.vue'
import searchBar from './searchbar.vue'
export default {
  components: {
    topBar,
    searchBar
  }
}
</script>

<style lang="scss">
  @import "../../../assets/css/public/header/index.scss";
</style>
