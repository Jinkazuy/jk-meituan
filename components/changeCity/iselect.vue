<!--// *******************-->
<!--// 省份搜索框-->
<!--// *******************-->
<template>
  <!--下边这些DOM结构都是饿了么UI框架提供的-->
  <div class="m-iselect">
    <span class="name">按省份选择:</span>
    <!--// 下拉框，选择省份-->
    <el-select
      v-model="pvalue"
      placeholder="省份"
    >
      <!--// 下拉项，循环-->
      <el-option
        v-for="item in province"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <!--// 下拉框，选择省份对应的城市-->
    <!--// :disabled="!city.length"当没有选择省份的时候，城市的值就是空的，那么城市的下拉框是禁用的-->
    <el-select
      v-model="cvalue"
      :disabled="!city.length"
      placeholder="城市"
    >
      <!--下拉项，选择城市-->
      <el-option
        v-for="item in city"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <!--// 搜索框-->
    <!--// :fetch-suggestions用户输入的时候触发-->
    <!--// @select 用户输入框下拉菜单某项被选中时触发-->
    <el-autocomplete
      v-model="input"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入城市中文或拼音"
      @select="handleSelect"
    />
  </div>
</template>

<script>
// 延迟发送ajax请求的第三包
import _ from 'lodash'
export default {
  data () {
    return {
      // 省份列表数据
      province: [],
      // 用户在下拉框选择的省份
      pvalue: '',
      // 城市列表数据，当用户选择了省份之后，发送请求获取对应的城市数据
      city: [],
      // 用户在城市下拉框选择的城市
      cvalue: '',
      // 搜索框内容
      input: '',
      // 全国城市列表，用于用户手动搜索
      cities: []
    }
  },
  watch: {
    // 监听用户在下拉框中选择的省份，当用户选择了省份之后，发送请求获取对应的城市数据
    async pvalue (newPvalue) {
      const self = this
      const { status, data: { city } } = await self.$axios.get(`/geo/province/${newPvalue}`)
      if (status === 200) {
        // 请求成功，将拿到的结果处理一下
        self.city = city.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        })
        // 将当前城市的下拉框中的值清空
        self.cvalue = ''
      }
    }
  },
  // 在mounted钩子时，发送请求，拿到的所有省份数据
  async mounted () {
    const self = this
    const { status, data: { province } } = await self.$axios.get('/geo/province')
    if (status === 200) {
      // 请求成功，将拿到的结果处理一下
      self.province = province.map((item) => {
        return {
          value: item.id,
          label: item.name
        }
      })
    }
  },
  methods: {
    // :fetch-suggestions用户在输入框手动输入城市的时候触发
    // 使用lodash这个延迟发送的第三方包
    querySearchAsync: _.debounce(async function (query, cb) {
      // 参数1就是输入框内的值，参数2是回调函数
      const self = this
      // 判断全国的城市数据的长度
      if (self.cities.length) {
        // 如果有，那么就将用户输入的内容，与全国城市做对比，
        // 然后将匹配到的内容取出来，filter返回的是一个新数组，不会改变this.cities的值
        // 这里没有对拼音做处理，有第三方的包，百度一下即可；
        cb(self.cities.filter(item => item.value.includes(query)))
      } else {
        // 如果没有全国城市的数据，那么就需要获取全国城市数据
        const { status, data: { city } } = await self.$axios.get('/geo/city')
        // 获取数据成功
        if (status === 200) {
          // 将结果处理一下
          self.cities = city.map((item) => {
            return {
              value: item.name
            }
          })
          // 此时有了全国城市的数据，那么就将用户输入的内容，与全国城市做对比，
          // 然后将匹配到的内容取出来，filter返回的是一个新数组，不会改变this.cities的值
          cb(self.cities.filter(item => item.value.includes(query)))
        } else {
          // cb([])
        }
      }
    }, 200),
    // 用户输入框下拉菜单某项被选中时触发
    handleSelect (item) {
      console.log(item.value)
    }
  }
}
</script>

<style lang="scss">
  @import "../../assets/css/changeCity/iselect.scss";
</style>
