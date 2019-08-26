<!--// ***************-->
<!--// 登录页-->
<!--// ***************-->
<template>
  <div class="page-login">
    <div class="login-header">
      <a href="/" class="logo" />
    </div>
    <div class="login-panel">
      <div class="banner">
        <img
          src="//s0.meituan.net/bs/file/?f=fe-sso-fs:build/page/static/banner/www.jpg"
          width="480"
          height="370"
          alt="美团网"
        >
      </div>
      <div class="form">
        <h4 v-if="error" class="tips">
          <i />{{ error }}
        </h4>
        <p><span>账号登录</span></p>
        <el-input v-model="username" prefix-icon="profile" />
        <el-input v-model="password" prefix-icon="password" type="password" />
        <div class="foot">
          <el-checkbox v-model="checked">
            7天内自动登录
          </el-checkbox>
          <b>忘记密码？</b>
        </div>
        <el-button class="btn-login" type="success" size="mini" @click="login">
          登录
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
// 载入加密的第三方包
import CryptoJS from 'crypto-js'
export default {
  data: () => {
    return {
      checked: '',
      username: '',
      password: '',
      error: ''
    }
  },
  layout: 'blank',
  methods: {
    login () {
      const self = this
      // 发送ajax请求，进行登录
      self.$axios.post('/users/signin', {
        // 将中文用户名进行编译
        username: window.encodeURIComponent(self.username),
        password: CryptoJS.MD5(self.password).toString()
      }).then(({ status, data }) => {
        // 如果登录成功，就跳转到网站的首页
        if (status === 200) {
          if (data && data.code === 0) {
            location.href = '/'
          } else {
            self.error = data.msg
          }
        } else {
          self.error = `服务器出错`
        }
        // 当然还要将http请求错误码同时定时的清空，否则错误提示会一直存在
        setTimeout(function () {
          self.error = ''
        }, 1500)
      })
    }
  }
}
</script>

<style lang="scss">
    @import "../assets/css/login/index.scss";
</style>
