<!--// *******************-->
<!--// 更改城市页-->
<!--// *******************-->
<template>
  <div class="page-changeCity">
    <!--// 省份搜索框-->
    <!--// 都占24列，所以就铺满了-->
    <el-row>
      <el-col :span="24">
        <iSelect />
      </el-col>
    </el-row>
    <!--// 热门城市组件-->
    <el-row>
      <el-col :span="24">
        <hot />
      </el-col>
    </el-row>
    <!--// 省份、城市列表-->
    <el-row>
      <el-col :span="24">
        <categroy />
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 省份搜索框
import iSelect from '../components/changeCity/iselect.vue'
// 热门城市组件
import Hot from '../components/changeCity/hot.vue'
// 省份、城市列表
import Categroy from '../components/changeCity/categroy.vue'
export default {
  components: {
    iSelect,
    Hot,
    Categroy
  }
}
</script>

<style lang="css">
</style>
