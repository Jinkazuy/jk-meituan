<!--// *******-->
<!--// 面包屑组件-->
<!--// *******-->
<template>
  <div class="m-crumbs">
    <!--面包屑，饿了么UI提供-->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">
        <!--为了ssr，这里用vuex中的数据即可，而且这个数据在之前已经获取过了-->
        {{ $store.state.geo.position.city.replace('市','') }}美团
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">{{ $store.state.geo.position.city.replace('市','') }}{{ decodeURIComponent(keyword) }}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {
    keyword: {
      type: String,
      default: ''
    }
  }
}
</script>
