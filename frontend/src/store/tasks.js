import * as Tasks from '@/api/tasks'

export default {
  namespaced: true,
  state: {
    tasks: [],
  },
  getters: {
    tasks: (state) => state.tasks,
  },
  mutations: {
    addTask(state, task) {
      state.tasks.push(task)
    },
    delTask(state, _id) {
      let idx = [...state.tasks].findIndex((t) => t._id === _id)
      if (+idx >= 0) {
        state.tasks.splice(idx, 1)
      }
    },
    setTasks(state, tasks) {
      state.tasks = tasks
    },
    editTask(state, field) {
        console.log(field);

      let idx = [...state.tasks].findIndex((t) => t._id === field._id)
      state.tasks[idx][field.name] = field.task
    },
  },
  actions: {
    async editTask({ commit }, { _id, task, name, callback }) {
      try {
        if (name === 'task') {
          await Tasks.editTask({ _id, task })
          commit('editTask', { _id, task, name })
          callback()
        }
      } catch (e) {
        console.log(e)
      }
    },

    async delTask({ commit }, _id) {
      try {
        await Tasks.delById(_id)
        commit('delTask', _id)
      } catch (e) {
        console.log(e)
      }
    },
    async getTasks({ commit }) {
      try {
        let { tasks } = await Tasks.all()
        commit(
          'setTasks',
          tasks.map((t) => ({ ...t, edit: false }))
        )
      } catch (e) {}
    },
    async addTask({ commit, dispatch }, task) {
      try {
        await Tasks.add(task)
        commit('addTask', task)
        dispatch('getTasks')
      } catch (e) {}
    },
  },
}
