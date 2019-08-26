// 新版nuxt.js不需要引入这些内容了，可以直接用（nuxt.js已经帮开发者做好了这些操作）
// import Vue from 'vue'
// import Vuex from 'vuex'

// 而且也不需要引入这些文件了，也可以直接使用
// import geo from './geo'
// import home from './home'

// Vue.use(Vuex)

// const store = () => new Vuex.Store({
//   modules: {
//     geo,
//     home
//   },
export const actions = {
  // 重点 https://zh.nuxtjs.org/guide/vuex-store/
  // 这个nuxtServerInit生命周期函数，只能在nuxt.js服务端执行
  // 如果在状态树中指定了 nuxtServerInit 方法，
  // Nuxt.js 调用它的时候会将页面的上下文对象作为第2个参数传给它（服务端调用时才会酱紫哟）。
  // 当我们想将服务端的一些数据传到客户端时，这个方法是灰常好用的。

  // 那么JK理解就是，在nuxt.js中写了这个生命周期，那么在编译的时候就会执行这个函数
  // 那么在编译的时候就进行一些数据的获取，然后存储到VUEX中；
  async nuxtServerInit ({ commit }, { req, app }) {
    // 向后台发送请求，拿到城市信息
    // 这个参数2的第2个参数，app拿到的就是vue实例
    const { status, data: { province, city } } = await app.$axios.get('/geo/getPosition')
    // 这里直接写geo/xxx那么调用的就是geo.js下mutations中的setPosition的函数
    // 然后这里用了三元表达式，其实就是判断上边发送的请求是否拿到了数据；
    // 然后用geo.js下的setPosition（actions）提交，存储vuex，然后vue页面中调用vuex的数据，就会更新了；
    commit('geo/setPosition', status === 200 ? { city, province } : { city: '', province: '' })

    // 获取首页左侧菜单，也就是一级导航分类的数据
    // 这个也必须使用ssr的方式，利于SEO，所以要在服务端编译时获取数据
    // 那么在用户拿到服务端返回的页面的时候，这些数据就已经在HTML结构中了；
    // 这里的status2是为了不跟上边的states重名
    const { status: status2, data: { menu } } = await app.$axios.get('geo/menu')
    commit('home/setMenu', status2 === 200 ? menu : [])

    // 热搜关键词
    const { status: status3, data: { result } } = await app.$axios.get('/search/hotPlace', {
      params: { city: app.store.state.geo.position.city.replace('市', '') }
    })
    commit('home/setHotPlace', status3 === 200 ? result : [])
  }
}
// })

// export default store
