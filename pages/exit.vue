<template>
  <div class="" />
</template>

<script>
export default {
  layout: 'blank',
  // middleware声明周期/中间件，是nuxt.js提供的的
  middleware: async (ctx) => {
    const { status, data } = await ctx.$axios.get('/users/exit')
    // 如果推出成功，就跳转到首页
    if (status === 200 && data && data.code === 0) {
      window.location.href = '/'
    }
  }
}
</script>
