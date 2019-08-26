<template>
  <!--// 首页左侧导航菜单-->
  <div class="m-menu">
    <!--// 固定显示的分类-->
    <dl class="nav" @mouseleave="mouseleave">
      <dt>全部分类</dt>
      <!--// 固定分类-->
      <!--// @mouseenter 鼠标移入时触发-->
      <dd v-for="(item,idx) in $store.state.home.menu" :key="idx" @mouseenter="enter">
        <i :class="item.type" />{{ item.name }}<span class="arrow" />
      </dd>
    </dl>
    <!--// 右侧二级分类弹窗-->
    <div v-if="kind" class="detail" @mouseenter="sover" @mouseleave="sout">
      <template v-for="(item,idx) in curdetail.child">
        <h4 :key="idx">
          {{ item.title }}
        </h4>
        <span v-for="v in item.child" :key="v">{{ v }}</span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      kind: ''
      // ,
      // // 这里的是假数据
      // menu: [{
      //   type: 'food',
      //   name: '美食',
      //   child: [{
      //     title: '美食',
      //     child: ['代金券', '甜点饮品', '火锅', '自助餐', '小吃快餐']
      //   }]
      // }, {
      //   type: 'takeout',
      //   name: '外卖',
      //   child: [{
      //     title: '外卖',
      //     child: ['美团外卖']
      //   }]
      // }, {
      //   type: 'hotel',
      //   name: '酒店',
      //   child: [{
      //     title: '酒店星级',
      //     child: ['经济型', '舒适/三星', '高档/四星', '豪华/五星']
      //   }]
      // }]
    }
  },
  // 监听计算属性
  computed: {
    // 当鼠标移入一级分类的时候，会将一级分类的type赋值给this.kind，
    // 然后使用这个kind的值，去一级分类中查找type===this.kind的内容，
    // 那么此时就找到了该分类，然后再取分类下的child属性，也就是二级分类
    // 再将这个计算属性的返回值进行循环，渲染二级分类菜单；
    curdetail () {
      // 使用.filter进行条件判断，去一级分类中查找type===this.kind的内容，
      // 因为this.data下的是假数据，而$store.home.menu中的才是真数据，所以在$store.home.menu中查找
      // 找到了的话，就取第0个数组，因为filter返回的是数组，所以取第0个值；
      return this.$store.state.home.menu.filter(item => item.type === this.kind)[0]
    }
  },
  methods: {
    // 鼠标移出一级分类时触发
    mouseleave () {
      const self = this
      // 清空二级分类，从而隐藏二级分类菜单
      self._timer = setTimeout(function () {
        self.kind = ''
      }, 150)
    },
    // 鼠标移入某个一级分类时触发，
    // 拿到该分类的DOM元素的.className属性（触发事件不传入参数的话，那么第一个实参就是这个DOM元素），
    // 那么也就是拿到this.menu下的某个分类的type属性
    // 然后将赋值给 this.kind，然后右侧的二级分类再通过这个type进行查找，从而渲染二级分类；
    enter (e) {
      this.kind = e.target.querySelector('i').className
    },
    // 当鼠标移入二级分类的时候，此时会触发一级分类的鼠标移出事件，也及时this.mouseleave ()，
    // 但这时候不能让this.kind===''，不然会隐藏二级菜单
    // 所以当鼠标移入二级分类，就清空鼠标移出一级分类的定时器，也就不会执行this.kind===''
    // 那么此时二级菜单就不会消失；
    sover () {
      clearTimeout(this._timer)
    },
    // 鼠标移出二级分类的时候，直接清空二级分类即可
    sout () {
      this.kind = ''
    }
  }
}
</script>

<style lang="css">
</style>
