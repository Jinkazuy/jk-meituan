// ***************
// 用户注册路由
// ***************

// 引入路由第三方包
import Router from 'koa-router'

// 引入Redis数据库包
import Redis from 'koa-redis'

// 给用户的邮箱发送邮件，除了在qq邮箱开启SMTP服务之外，还需要在此安装这个包
import nodeMailer from 'nodemailer'

// 引入自己写的mongo用户集合的数据结构模型
import User from '../dbs/models/users'

// 引入数据库配置文件，这里起名叫做Email是因为语义化，其实叫做dbconfig也可以
import Email from '../dbs/config'

// 引入用于验证用户信息的文件
import Passport from './utils/passport'

// 引入自己封装的发送ajax请求的内容，因为需要一些前置内容，所以不能直接使用axios第三方
import axios from './utils/axios'

// 创建路由，并且设置前缀，那么在请求的时候就如：http://ww.baidu.com/users/xxx
const router = new Router({ prefix: '/users' })

// 实例化Redis数据库，用来进行用户信息的效验
const Store = new Redis().client

// 注册接口
router.post('/signup', async (ctx) => {
  // 获取post请求体
  const { username, password, email, code } = ctx.request.body

  // 判断
  // 先判断验证码
  if (code) {
    // 在发送验证码的时候，同时把验证码存到了Redis数据库中，此时就取出来，然后进行比较
    const saveCode = await Store.hget(`nodemail:${username}`, 'code')
    // 拿到过期时间
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    // 判断，post请求体的验证码和发送给用户的验证码是否一致
    if (code === saveCode) {
      // 两个验证码一致，再进行判断是否过期
      if (new Date().getTime() - saveExpire > 0) {
        // 如果当前时间减去设置的过其时间大于0，说明已经过其了，返回提示内容，并且结束后续函数运行
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新尝试'
        }
        return false
      }
    } else {
      // 两个验证码不一致，直接返回字符串
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      }
    }
  } else {
    // 如果没有验证码，则返回提示内容
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }
  // 如果前边验证都通过，说明验证码没有问题
  // 这里进行用户是否已存在的验证
  const user = await User.find({ username })
  if (user.length) {
    // 如果查找到的用户名不是0，说明已经被注册，返回提示信息，并且结束后续函数运行
    ctx.body = {
      code: -1,
      msg: '已被注册'
    }
    return
  }
  // 验证码正确、用户没有被注册，这里创建新的用户数据
  // 返回值是被创建的结果（应该是，JK不确定）
  const nuser = await User.create({ username, password, email })
  if (nuser) {
    // 如果这个nuser变量接收的返回值有内容，说明新增数据库中的条目成功了，也就是注册成功了
    // 然后进行登录，返回用户信息
    const res = await axios.post('/users/signin', { username, password })
    // 返回值的内容就是用户信息，也就是在用户注册后，进行自动登录操作，然后将用户信息返回
    if (res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      }
    } else {
      // 进入到这里，说明登录操作失败了
      ctx.body = {
        code: -1,
        msg: '注册成功，但自动登录失败'
      }
    }
  } else {
    // 进入到这里，说明写入数据库失败了
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
  }
})

// 登录路由
router.post('/signin', (ctx, next) => {
  // 这里还是用到了Passport第三方包的功能
  return Passport.authenticate('local', function (err, user, info, status) {
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else if (user) {
      ctx.body = {
        code: 0,
        msg: '登录成功',
        user
      }
      return ctx.login(user)
    } else {
      ctx.body = {
        code: 1,
        msg: info
      }
    }
  })(ctx, next)
})

// 发送验证接口
router.post('/verify', async (ctx, next) => {
  // 拿到用户名
  const username = ctx.request.body.username
  // 拿到验证码的过期时间
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
  // 判断，是否有过其时间，并且当前时间减去过期时间<0，那么说明请求过于频繁，返回提示信息并结束后续代码运行；
  // 这里是为了防止频繁刷发送验证码邮件接口
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁，1分钟内1次'
    }
    return false
  }
  // 过期时间没问题，那么进行发送邮件的操作
  // 设置发送的配置项
  const transporter = nodeMailer.createTransport({
    service: 'qq',
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  // 设置要发送的那些信息
  const ko = {
    // 随机验证码
    code: Email.smtp.code(),
    // 设置过期时间
    expire: Email.smtp.expire(),
    // 给谁哪个邮箱，拿到用户的邮箱
    email: ctx.request.body.email,
    // 用户名
    user: ctx.request.body.username
  }
  // 设置发送邮件内显示的内容
  const mailOptions = {
    // 发送方
    from: `"认证邮件" <${Email.smtp.user}>`,
    // 接收方邮箱
    to: ko.email,
    // 邮件主题
    subject: '《慕课网高仿美团网全栈实战》注册码',
    // 邮件内容
    html: `您在《慕课网高仿美团网全栈实战》课程中注册，您的邀请码是${ko.code}`
  }
  // 发送邮件
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    } else {
      // 发送成功，将发送的内容储存到Redis数据库中，用于后续的校验
      Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }
  })
  // 代码进行到这里，说明邮件已经发送，那么返回信息给前台
  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延时，有效期1分钟'
  }
})

// 退出登录接口，这里使用get请求就行
router.get('/exit', async (ctx, next) => {
  // 执行一个退出的动作，这个API是 Passport提供的
  await ctx.logout()
  // 判断当前是否是登录状态，这里取反，这个API是 Passport提供的
  if (!ctx.isAuthenticated()) {
    // 如果不是登录状态说明退出成功了
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})

// 获取用户名接口
router.get('/getUser', (ctx) => {
  // 检查是否是登录状态
  if (ctx.isAuthenticated()) {
    // 如果是登录状态，那么就到session中获取该用户信息，然后将用户名返回给前台
    const { username, email } = ctx.session.passport.user
    ctx.body = {
      user: username,
      email
    }
  } else {
    // 如果没有登录，那么返回空字符串
    ctx.body = {
      user: '',
      email: ''
    }
  }
})

// 导出这个router
export default router
