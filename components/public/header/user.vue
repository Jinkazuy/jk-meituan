<template>
  <div class="m-user">
    <!--// 在mounted钩子的时候发送请求，获取用户是否已经登录-->
    <!--// 已经登录-->
    <template v-if="user">
      欢迎您，<span class="username">{{ user }}</span>
      <!--// 退出登录，路由跳转-->
      [<nuxt-link to="/exit">
        退出
      </nuxt-link>]
    </template>
    <!--// 未登录，则提示用户进行登录，使路由 跳转到登录页或者注册页-->
    <template v-else>
      <nuxt-link
        to="/login"
        class="login"
      >
        立即登录
      </nuxt-link>
      <nuxt-link
        class="register"
        to="/register"
      >
        注册
      </nuxt-link>
    </template>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: ''
    }
  },
  async mounted () {
    // 在mounted钩子的时候向后台发送请求，后台接到请求，拿到其中自带的cookies，然后换取session，判断用户是否已经登录
    // 如果登录，就将用户信息返回，如果没有登录，用户信息则为空，
    // 所以，可以使用用户的信息作为渲染 用户名 还是渲染登录注册按钮
    // 这个项目初始化的时候已经选择了axios，所以会自动挂载到vue实中了，所以可以使用this.$axios来使用axios这个第三方包
    const { status, data: { user } } = await this.$axios.get('/users/getUser')
    if (status === 200) {
      this.user = user
    }
  }
}
</script>

<style lang="css">
</style>
