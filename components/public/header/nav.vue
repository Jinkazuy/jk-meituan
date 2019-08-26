<template>
  <div class="m-nav">
    <!--// 因为这里的结构都是静态的，基本都是跳转链接，所以直接写死在这里即可-->
    <!--// 那么最外层就用ul>li*4即可，然后再在每个li中写分别的下拉菜单-->
    <ul class="nav">
      <li class="list">
        <nuxt-link to="/my">
          我的美团
        </nuxt-link>
        <!--// 下拉菜单使用dl dd的结构写，在鼠标移入hover的时候显示-->
        <!--// 样式写成跟下拉菜单一样即可-->
        <!--// 另外，障眼法，投影，因为下拉菜单DOM层级高于'我的美团这个便签'，所以下拉菜单会遮挡住'我的美团'的投影-->
        <!--// 所以看起来就变成一体的了-->
        <dl>
          <dd>
            <nuxt-link to="/order">
              我的订单
            </nuxt-link>
          </dd>
          <dd>
            <nuxt-link to="/order">
              我的收藏
            </nuxt-link>
          </dd>
          <dd>
            <nuxt-link to="/order">
              抵用券
            </nuxt-link>
          </dd>
          <dd>
            <nuxt-link to="/order">
              账户设置
            </nuxt-link>
          </dd>
        </dl>
      </li>
      <li>
        <nuxt-link to="/order">
          手机APP
        </nuxt-link>
      </li>
      <li class="list bd">
        <nuxt-link to="/center">
          商家中心
        </nuxt-link>
        <dl>
          <dd>
            <nuxt-link to="/userCenter">
              登录商家中心
            </nuxt-link>
          </dd>
          <dd>
            <nuxt-link to="/coop">
              我想合作
            </nuxt-link>
          </dd>
          <dd>
            <nuxt-link to="/wap">
              免费手机开店
            </nuxt-link>
          </dd>
          <dd>
            <nuxt-link to="/kaipiao">
              商家申请开票
            </nuxt-link>
          </dd>
        </dl>
      </li>
      <li class="list site">
        <nuxt-link to="/site">
          网站导航
        </nuxt-link>
        <div class="subContainer">
          <dl class="hotel">
            <dt>酒店旅游</dt>
            <dd>国际机票</dd>
            <dd>国际机票</dd>
            <dd>国际机票</dd>
            <dd>国际机票</dd>
            <dd>国际机票</dd>
            <dd>国际机票</dd>
            <dd>国际机票</dd>
            <dd>国际机票</dd>
            <dd>国际机票</dd>
            <dd>国际机票</dd>
            <dd>国际机票</dd>
            <dd>国际机票</dd>
            <dd>国际机票</dd>
            <dd>国际机票</dd>
            <dd>国际机票</dd>
          </dl>
          <dl class="food">
            <dt>吃美食</dt>
            <dd>烤鱼</dd>
            <dd>特色小吃</dd>
            <dd>烧烤</dd>
            <dd>烧烤</dd>
            <dd>烧烤</dd>
            <dd>烧烤</dd>
          </dl>
          <dl class="movie">
            <dt>看电影</dt>
            <dd>热映电影</dd>
            <dd>热映电影</dd>
            <dd>热映电影</dd>
            <dd>热映电影</dd>
            <dd>热映电影</dd>
            <dd>热映电影</dd>
            <dd>热映电影</dd>
          </dl>
          <dl class="app">
            <dt>手机应用</dt>
            <dd>
              <a href="#">
                <img
                  src="//s0.meituan.net/bs/fe-web-meituan/e5eeaef/img/appicons/meituan.png"
                  title="美团app"
                  alt="美团app"
                >
              </a>
            </dd>
            <dd>
              <a href="#">
                <img
                  src="//s0.meituan.net/bs/fe-web-meituan/e5eeaef/img/appicons/meituan.png"
                  title="美团app"
                  alt="美团app"
                >
              </a>
            </dd>
            <dd>
              <a href="#">
                <img
                  src="//s0.meituan.net/bs/fe-web-meituan/e5eeaef/img/appicons/meituan.png"
                  title="美团app"
                  alt="美团app"
                >
              </a>
            </dd>
            <dd>
              <a href="#">
                <img
                  src="//s0.meituan.net/bs/fe-web-meituan/e5eeaef/img/appicons/meituan.png"
                  title="美团app"
                  alt="美团app"
                >
              </a>
            </dd>
            <dd>
              <a href="#">
                <img
                  src="//s0.meituan.net/bs/fe-web-meituan/e5eeaef/img/appicons/meituan.png"
                  title="美团app"
                  alt="美团app"
                >
              </a>
            </dd>
          </dl>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="css">
</style>
