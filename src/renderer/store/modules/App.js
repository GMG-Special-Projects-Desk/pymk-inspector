const state = {
  dbPath: '',
  hasCredentials: false,
  username: '',
  serviceName: 'pymkinspector',
  summary: {},
  scrapeFrequency: 2,
  mostRecent: {}
}

const getters = {
  dbPath: state => state.dbPath,
  hasCredentials: state => state.hasCredentials,
  username: state => state.username,
  serviceName: state => state.serviceName,
  summary: state => state.summary,
  mostRecent: state => state.mostRecent,
  scrapeFrequency: state => state.scrapeFrequency
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
    state.scrapeFrequency = 2
  },
  SET_SUMMARY (state, summary) {
    state.summary = summary
  },
  SET_MOST_RECENT (state, mostRecent) {
    state.mostRecent = mostRecent
  },
  SET_FREQUENCY (state, freq) {
    state.scrapeFrequency = freq
  }
}

const actions = {
  setDbPath ({ commit }, dbPath) {
    commit('SET_DB_PATH', dbPath)
  },
  setCredentials ({ commit }, username) {
    commit('SET_CREDENTIALS', username)
  },
  deleteCredentials ({ commit }) {
    commit('DELETE_CREDENTIALS')
  },
  setMostRecent ({ commit }, mostRecent) {
    commit('SET_MOST_RECENT', mostRecent)
  },
  setSummary ({ commit }, summary) {
    commit('SET_SUMMARY', summary)
  },
  setFrequency ({ commit }, freq) {
    commit('SET_FREQUENCY', freq)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
