<!--// *******************-->
<!--// 省份、城市列表-->
<!--// *******************-->
<template>
  <div class="">
    <!--// 索引字母-->
    <dl class="m-categroy">
      <dt>按拼音首字母选择：</dt>
      <dd
        v-for="item in list"
        :key="item"
      >
        <!--// 点击跳转到对应的ID值是href的DOM节点的位置-->
        <a :href="'#city-'+item">{{ item }}</a>
      </dd>
    </dl>
    <!--城市列表-->
    <dl
      v-for="item in block"
      :key="item.title"
      class="m-categroy-section"
    >
      <!--// 这里的ID值，和上边的A连接的href对应-->
      <dt :id="'city-'+item.title">
        {{ item.title }}
      </dt>
      <!--城市名称-->
      <dd>
        <span
          v-for="c in item.city"
          :key="c"
        >{{ c }}</span>
      </dd>
    </dl>
  </div>
</template>

<script>
// 第三方拼音库
import pyjs from 'js-pinyin'
export default {
  data () {
    return {
      // 将26个字母拆分成数组
      list: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      // 所有城市列表数据
      block: []
    }
  },
  // 在mounted钩子时，获取城市列表数据，并且进行排序
  // 这里用ssr的方式没有太大必要，如果要是做SEO的话，
  // 可以用vuex 在nuxtServerInit钩子时获取数据，然后在这里获取vuex数据即可实现ssr
  async mounted () {
    const self = this
    const blocks = []
    // 拿到所有城市名称
    const { status, data: { city } } = await self.$axios.get('/geo/city')
    // 判断是否成功
    if (status === 200) {
      let p
      let c
      const d = {}
      // 循环所有城市名称
      city.forEach((item) => {
        // 用js-pinyin这个第三方包，来解析中文的拼音
        // 取每个城市名称的首字母，然后提取拼音
        // pyjs.getFullChars是获取拼音的全拼
        // .toLocaleLowerCase转成小写，然后取第一个字母
        // 经过一番折腾，就拿到了某个城市的首字母
        p = pyjs.getFullChars(item.name).toLocaleLowerCase().slice(0, 1)
        // 用这个首字母进行排序，那么'a'.charCodeAt结果就是97 z就是 122，这是js转译的规则；
        c = p.charCodeAt(0)
        if (c > 96 && c < 123) {
          // 那么此时说明这个字母是a-z之间的
          // 判断一下，如果没有a-z之间的某个字母，那么就用这个字母创建一个空数组，并且是在d变量下；
          if (!d[p]) {
            d[p] = []
          }
          // 此时有了a-z的某个字母的数组，那么就将这个城市追加到这个字母的数组之下即可
          // 此时的数据结构是这种对象的键值对；
          // {
          // a: Array(10) [ "阿拉善盟", "鞍山市", "安庆市", … ],
          // b: Array(19) [ "北京市", "保定市", "包头市", … ]
          // }
          d[p].push(item.name)
        }
      })
      // 将d这个临时变量值进行序列化一下
      // Object.entries() 可以把一个对象的键值以数组的形式遍历出来，
      // 那么得到的数组的第0个元素就是对象的键，也及是字母，
      // 第1个元素就是对象的值，也就是城市名城市；
      // 0: Array [ "b", Array(19) [ "北京市", "保定市", "包头市", … ] ]
      // 1: Array [ "t", Array(15) [ "天津市", "唐山市", "太原市", … ] ]
      for (const [k, v] of Object.entries(d)) {
        // 将序列化好的数据一个一个追加到this下的block数组下，持久化这些数据
        blocks.push({
          // k就是a-z的某个字符串，然后将其转成大写
          title: k.toUpperCase(),
          // v拿到的就是城市名称的数组
          city: v
        })
      }
      // 使用.sort方法进行排序
      blocks.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
      // 排序后，然后持久化
      self.block = blocks
    }
  }
}
</script>

<style lang="scss">
  @import "../../assets/css/changeCity/categroy.scss";
</style>
