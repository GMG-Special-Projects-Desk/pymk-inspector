const state = {
  dbPath: ''
}

const getters = {
  dbPath: state => state.dbPath
}

const mutations = {
  SET_DB_PATH (state, dbPath) {
    state.dbPath = dbPath
  }
}

const actions = {
  setDbPath ({ commit }, dbPath) {
    commit('SET_DB_PATH', dbPath)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
