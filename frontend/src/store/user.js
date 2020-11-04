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
    /* asinc getUser() {}, */
    setUser({ commit }, user) {
      commit('setUser', user)
    },
  },
}
