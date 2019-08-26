<!--// ***************-->
<!--// 注册页-->
<!--// ***************-->
<template>
  <div class="page-register">
    <!--// 顶部导航-->
    <article class="header">
      <header>
        <a href="/" class="site-logo" />
        <span class="login">
          <em class="bold">已有美团账号？</em>
          <a href="/login">
            <el-button
              type="primary"
              size="small"
            >登录</el-button>
          </a>
        </span>
      </header>
    </article>
    <!--// 登录表单-->
    <!--// 这些表单的内容用的是饿了么的UI框架，框架中也提供一些表单验证，就省的自己写了-->
    <!--// :rules 表单效验规则-->
    <section>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <!--// 填写昵称-->
        <el-form-item label="昵称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <!--// 填写邮箱-->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" />
          <!--// 发送验证码-->
          <el-button size="mini" round @click="sendMsg">
            发送验证码
          </el-button>
          <span class="status">{{ statusMsg }}</span>
        </el-form-item>
        <!--// 填写验证码-->
        <el-form-item label="验证码" prop="code">
          <el-input v-model="ruleForm.code" maxlength="4" />
        </el-form-item>
        <!--// 填写密码-->
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="ruleForm.pwd" type="password" />
        </el-form-item>
        <!--// 确认密码-->
        <el-form-item label="确认密码" prop="cpwd">
          <el-input v-model="ruleForm.cpwd" type="password" />
        </el-form-item>
        <!--// 注册按钮-->
        <el-form-item>
          <!--// 点击注册按钮时-->
          <el-button type="primary" @click="register">
            同意以下协议并注册
          </el-button>
          <!--// 错误信息-->
          <div class="error">
            {{ error }}
          </div>
        </el-form-item>
        <!--// 协议（没有复选框）-->
        <el-form-item>
          <a class="f1" href="http://www.meituan.com/about/terms" target="_blank">《美团网用户协议》</a>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
// 引入加密的第三方包
import CryptoJS from 'crypto-js'
export default {
  data () {
    return {
      statusMsg: '',
      // 错误提示信息
      error: '',
      // 表单中填写的内容
      ruleForm: {
        name: '',
        code: '',
        pwd: '',
        cpwd: '',
        email: ''
      },
      // 校验规则，饿了么的UI框架的标签中有:rules="rules"属性，就用用来填写校验规则的，
      // 那么这里就定义校验规则&错误提示信息；
      rules: {
        name: [{
          // 是否是必选项
          required: true,
          // 类型
          type: 'string',
          // 错误提示信息
          message: '请输入昵称',
          // 何时出发效验
          trigger: 'blur'
        }],
        email: [{
          required: true,
          type: 'email',
          message: '请输入邮箱',
          trigger: 'blur'
        }],
        pwd: [{
          required: true,
          message: '创建密码',
          trigger: 'blur'
        }],
        cpwd: [{
          required: true,
          message: '确认密码',
          trigger: 'blur'
        }, {
          // 确认密码时候需要进行条件的判断，这里如果看不懂可以看饿了么UI的文档；
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value !== this.ruleForm.pwd) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }]
      }
    }
  },
  // 使用layouts/下的blank.vue这个模板文件；
  layout: 'blank',
  methods: {
    // ========= 点击发送验证码按钮时触发 =========
    sendMsg () {
      const self = this
      let namePass
      let emailPass
      // 倒计时，如果倒计时不为0的话，那么直接返回，结束后续代码运行
      if (self.timerid) {
        return false
      }
      // 验证用户名是否通过校验
      // .validateField方法是饿了么的UI框架的API
      // .validateField(props: array | string, callback: Function(errorMessage: string))
      this.$refs.ruleForm.validateField('name', (valid) => {
        // 传入的参数就是错误信息
        namePass = valid
      })
      // 清空错误提示消息
      self.statusMsg = ''
      // 如果没有通过用户名效验，就结束后续代码
      if (namePass) {
        return false
      }

      // 验证邮箱是否通过验证
      this.$refs.ruleForm.validateField('email', (valid) => {
        emailPass = valid
      })

      // 验证，这里取反，那么就是 用户名与邮箱验证都没有错误信息，也就是都通过验证
      if (!namePass && !emailPass) {
        // 向后台发送请求，获取验证码，并且将用户名和邮箱发送过去；
        self.$axios.post('/users/verify', {
          // encodeURIComponent 将中文进行编码
          username: encodeURIComponent(self.ruleForm.name),
          email: self.ruleForm.email
        }).then(({
          // 然后拿到返回值
          status,
          data
        }) => {
          // 判断返回值
          if (status === 200 && data && data.code === 0) {
            // 如果没有错误
            // 定义重发验证码按钮倒计时（这里是前台的限制，其实后台也有60秒的限制，防止刷接口）
            let count = 60
            self.statusMsg = `验证码已发送,剩余${count--}秒`

            // 然后设置定时器，每隔1秒
            self.timerid = setInterval(function () {
              self.statusMsg = `验证码已发送,剩余${count--}秒`
              // 判断，如果倒计时等于0了，就清空定时器
              if (count === 0) {
                clearInterval(self.timerid)
              }
            }, 1000)
          } else {
            // 如果返回值有错误，那么直接展示
            self.statusMsg = data.msg
          }
        })
      }
    },
    // ========= 点击注册按钮时触发 =========
    register () {
      const self = this
      // 这里的validate是饿了么的UI框架的API
      // 第一个参数为true的话，说明所有效验都通过了
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 所有效验都通过了
          // 那么发送ajax请求，进行注册流程
          self.$axios.post('/users/signup', {
            // 将用户名、密码、邮箱、验证码都发给后台
            // 将中文用户名进行编译
            username: window.encodeURIComponent(self.ruleForm.name),
            // 这里用一个CryptoJS.MD5对密码进行加密处理
            password: CryptoJS.MD5(self.ruleForm.pwd).toString(),
            email: self.ruleForm.email,
            code: self.ruleForm.code
          }).then(({
            // 接收后台处理的返回值
            status,
            data
          }) => {
            // 如果http请求状态码是200，那么就效验code是否===0
            if (status === 200) {
              if (data && data.code === 0) {
                // 注册成功的话，那么就将URL地址跳转到登录页
                location.href = '/login'
              } else {
                // 如果没有注册成功，就将错误信息展示给用户
                self.error = data.msg
              }
            } else {
              // 如果http请求不是200，说明出了其他错误，那么就将错误状态码展示给用户
              self.error = `服务器出错，错误码:${status}`
            }
            // 当然还要将http请求错误码同时定时的清空，否则错误提示会一直存在
            setTimeout(function () {
              self.error = ''
            }, 1500)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "../assets/css/register/index.scss";
</style>
