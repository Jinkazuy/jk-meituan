// 声明state数据
export const state = () => ({ position: {} })

// 声明mutations
// 操作state数据的行为都放在mutations中
export const mutations = {
  setPosition (state, val) {
    state.position = val
  }
}

// 声明actions，
// 操作mutations的行为都放在actions中
export const actions = {
  setPosition: ({ commit }, position) => {
    commit('setPosition', position)
  }
}
