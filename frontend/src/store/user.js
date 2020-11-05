import * as User from '@/api/user'

export default {
  namespaced: true,
  state: {
    user: null,
  },
  getters: {
    user: (state) => state.user,
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      console.log()
    },
  },
  actions: {
    async getUser({ commit }) {
      try {
        let res = await User.check()
        commit('setUser', res)
       
      } catch (e) {
        commit('setUser', null)
      }
    },
    setUser({ commit }, user) {
      commit('setUser', user)
    },
  },
}
