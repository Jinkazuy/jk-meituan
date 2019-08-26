export const state = () => ({ menu: [], hotPlace: [] })

export const mutations = {
  // 首页左侧一级导航
  setMenu (state, val) {
    state.menu = val
  },
  // 首页热搜关键词
  setHotPlace (state, val) {
    state.hotPlace = val
  }
}

export const actions = {
  setMenu: ({
    commit
  }, menu) => {
    commit('setMenu', menu)
  },
  setHotPlace: ({
    commit
  }, hotPlace) => {
    commit('setHotPlace', hotPlace)
  }
}
