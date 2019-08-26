<!--// 地图组件-->
<template>
  <div
    :id="id"
    :style="{width:width+'px',height:height+'px',margin:'34px auto'}"
    class="m-map"
  />
</template>

<script>
export default {
  // 父级传入参数
  props: {
    // 地图组件的宽
    width: {
      type: Number,
      default: 300
    },
    // 地图组件的高度
    height: {
      type: Number,
      default: 300
    },
    // 经纬度
    point: {
      type: Array,
      default () {
        return [116.46, 39.92]
      }
    }
  },
  data () {
    return {
      // 这里需要先定义一个静态的id值，不然下方的this.id会出问题；
      id: `map`,
      // 高德地图的开发者的key
      key: '0dbc0dfd7c775f2a927174493eab8220'
    }
  },
  watch: {
    point (val, old) {
      this.map.setCenter(val)
      this.marker.setPosition(val)
    }
  },
  // 在mounted钩子时发送请求，拿到地图
  mounted () {
    const self = this
    self.id = `map${Math.random().toString().slice(4, 6)}`

    // 只有在mounted钩子下才能拿到的window对象
    // 下边的这些api都是高地地图提供的
    window.onmaploaded = () => {
      const map = new window.AMap.Map(self.id, {
        resizeEnable: true,
        zoom: 11,
        center: self.point
      })
      self.map = map

      // 放大缩小控件，高德地图提供
      window.AMap.plugin('AMap.ToolBar', () => {
        const toolbar = new window.AMap.ToolBar()
        map.addControl(toolbar)
        // marker就是小红点icon，也是高德地图提供
        const marker = new window.AMap.Marker({
          icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          position: self.point
        })
        self.marker = marker
        marker.setMap(map)
      })
    }
    const url = `https://webapi.amap.com/maps?v=1.4.10&key=${self.key}&callback=onmaploaded`
    const jsapi = document.createElement('script')
    jsapi.charset = 'utf-8'
    jsapi.src = url
    document.head.appendChild(jsapi)
  }
}
</script>
