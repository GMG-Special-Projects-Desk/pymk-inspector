const state = {
  dbPath: '',
  hasCredentials: false,
  username: '',
  serviceName: 'pymkinspector'
}

const getters = {
  dbPath: state => state.dbPath,
  hasCredentials: state => state.hasCredentials,
  username: state => state.username,
  serviceName: state => state.serviceName
}

const mutations = {
  SET_DB_PATH (state, dbPath) {
    state.dbPath = dbPath
  },
  SET_CREDENTIALS (state, username) {
    state.username = username
    state.hasCredentials = true
  },
  DELETE_CREDENTIALS (state) {
    state.username = ''
    state.hasCredentials = false
  }
}

const actions = {
  setDbPath ({ commit }, dbPath) {
    commit('SET_DB_PATH', dbPath)
  },
  setCredentials ({ commit }, username) {
    commit('SET_CREDENTIALS', username)
  },
  deleteCredentials ({ commit }, username) {
    commit('DELETE_CREDENTIALS')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
