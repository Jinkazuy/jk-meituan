<template>
  <div class="search-panel">
    <el-row class="m-header-searchbar">
      <!--// 这里用的就是饿了么的UI框架，自适应栅格化的结构，24栅格-->
      <!--// 左侧logo，占3份，这个:span属性就是栅格的份数-->
      <el-col
        :span="3"
        class="left"
      >
        <img
          src="//s0.meituan.net/bs/fe-web-meituan/e5eeaef/img/logo.png"
          alt="美团"
        >
      </el-col>
      <!--// 中间搜索框，占15份-->
      <el-col
        :span="15"
        class="center"
      >
        <!--// 搜索框部分的最外层-->
        <div class="wrapper">
          <!--// 输入框-->
          <!--// @focus 获取焦点时，情况有两种，1是没有输入内容 那么下拉菜单显示热搜，2是用户输入了内容 那么下拉菜单显示词汇相关推荐-->
          <!--// @blur 失去焦点时，隐藏输入框的下拉菜单-->
          <!--// @input 当输入框文字发生变化时触发，根据输入内容&vuex中的城市，发送ajax请求，从而获取与用户输入的内容相关的搜素建议-->
          <!--// 那么拿到ajax返回的搜搜建议结果，显示下拉菜单-->
          <el-input
            v-model="search"
            placeholder="搜索商家或地点"
            @focus="focus"
            @blur="blur"
            @input="input"
          />
          <!--// 搜索按钮-->
          <button class="el-button el-button--primary">
            <i class="el-icon-search" />
          </button>
          <!--// 热门搜索-->
          <!--// 两种情况-->
          <!--// 情况1：当搜索框获取焦点，但没有输入搜索内容的时候，下拉菜单显示热门搜索-->
          <dl v-if="isHotPlace" class="hotPlace">
            <dt>热门搜索</dt>
            <!--这个热门搜索的关键词，是从vuex中，页面初始化的时候vuex就拿到，然后这里在从vuex中取出来-->
            <dd v-for="(item,idx) in $store.state.home.hotPlace.slice(0,5)" :key="idx">
              <a :href="'/products?keyword='+encodeURIComponent(item.name)">{{ item.name }}</a>
            </dd>
          </dl>
          <!--// 情况2：当搜索框获取获取焦点，并且用户输入了搜索关键词的时候，下拉菜单显示相关搜索建议-->
          <!--// 相关搜索建议-->
          <dl v-if="isSearchList" class="searchList">
            <dd v-for="(item,idx) in searchList" :key="idx">
              <a :href="'/products?keyword='+encodeURIComponent(item.name)">{{ item.name }}</a>
            </dd>
          </dl>
        </div>
        <p class="suggest">
          <a
            v-for="(item,idx) in $store.state.home.hotPlace.slice(0,5)"
            :key="idx"
            :href="'/products?keyword='+encodeURIComponent(item.name)"
          >{{ item.name }}</a>
        </p>
        <!--// 搜索框下的文字导航-->
        <ul class="nav">
          <li>
            <nuxt-link to="/" class="takeout">
              美团外卖
            </nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="movie">
              猫眼电影
            </nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="hotel">
              美团酒店
            </nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="apartment">
              民宿/公寓
            </nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="business">
              商家入驻
            </nuxt-link>
          </li>
        </ul>
      </el-col>
      <!--// 右侧保障，占6份-->
      <el-col :span="6" class="right">
        <ul class="security">
          <li>
            <i class="refund" /><p class="txt">
              随时退
            </p>
          </li>
          <li>
            <i class="single" /><p class="txt">
              不满意免单
            </p>
          </li>
          <li>
            <i class="overdue" /><p class="txt">
              过期退
            </p>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 延迟用的第三方库，记得安装
import _ from 'lodash'
export default {
  data () {
    return {
      // 输入框中的内容，也就是用户输入的内容
      search: '',
      // 搜索框是否获取焦点
      isFocus: false,
      // 热搜关键词
      hotPlace: [],
      // 搜索推荐关键词列表
      searchList: []
    }
  },
  // 监听计算属性
  computed: {
    // 两种情况
    // 情况1：当搜索框获取焦点，但没有输入搜索内容的时候，下拉菜单显示热门搜索
    isHotPlace () {
      return this.isFocus && !this.search
    },
    // 情况2：当搜索框获取获取焦点，并且用户输入了搜索关键词的时候，下拉菜单显示相关搜索建议
    isSearchList () {
      return this.isFocus && this.search
    }
  },
  methods: {
    // 搜索框获取焦点时
    // 将这个isFocus变量噶为true，那么监听计算属性机就会监听到这个值的变化，
    // 然后再进行判断 用户是否输入了内容，从而决定下拉菜单 渲染 热搜词汇 还是渲染搜索内容相关推荐词汇；
    focus () {
      this.isFocus = true
    },
    // 搜索框失去焦点时
    blur () {
      const self = this
      // 这里要做一个延迟隐藏下拉菜单的效果
      // 因为用户点击搜索结果 或 热搜词汇的时候，已经出发了输入框的blur事件，
      // 所以会出现下拉菜单瞬间消失的情况，所以这里用延迟改变ifFocus的状态，就解决了；
      setTimeout(function () {
        self.isFocus = false
      }, 200)
    },
    // 当输入框文字发生变化时触发，根据输入内容，发送ajax请求，从而获取与用户输入的内容相关的搜素建议；
    // 这里用了第三方包，用于延迟发送请求的，否则每次输入都会立刻发送请求；
    input: _.debounce(async function () {
      const self = this
      // 拿到用户所在城市
      const city = self.$store.state.geo.position.city.replace('市', '')
      // 将搜索建议先清空
      self.searchList = []
      // 发送ajax请求，将用户输入的内容&用户所在城市发送给后台，
      // 后台根据接收到的内容，返回搜索建议词汇
      const { data: { top } } = await self.$axios.get('/search/top', {
        params: {
          input: self.search,
          city
        }
      })
      // 取搜索关键词的前10个
      self.searchList = top.slice(0, 10)
    }, 300)
  }
}
</script>

<style lang="css">
</style>
