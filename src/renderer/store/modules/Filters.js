const state = {
  pymkFilters: ['mutualFriends', 'created', 'name', 'created', 'fbid', 'job', 'mutualFriends', 'sessions'],
  sessionFilters: ['totalPymk', 'numNoMutual', 'numSeenBefore', 'numNew', 'timestamp']
}

const getters = {
  pymkFilters: state => state.pymkFilters,
  sessionFilters: state => state.sessionFilters
}

// const mutations = {
//   SET_DB_PATH (state, dbPath) {
//     state.dbPath = dbPath
//   },
//   SET_CREDENTIALS (state, username) {
//     state.username = username
//     state.hasCredentials = true
//   },
//   DELETE_CREDENTIALS (state) {
//     state.username = ''
//     state.hasCredentials = false
//     state.scrapeFrequency = 2
//   },
//   SET_SUMMARY (state, summary) {
//     state.summary = summary
//   },
//   SET_MOST_RECENT (state, mostRecent) {
//     state.mostRecent = mostRecent
//   },
//   SET_FREQUENCY (state, freq) {
//     state.scrapeFrequency = freq
//   }
// }

// const actions = {
//   setDbPath ({ commit }, dbPath) {
//     commit('SET_DB_PATH', dbPath)
//   },
//   setCredentials ({ commit }, username) {
//     commit('SET_CREDENTIALS', username)
//   },
//   deleteCredentials ({ commit }) {
//     commit('DELETE_CREDENTIALS')
//   },
//   setMostRecent ({ commit }, mostRecent) {
//     commit('SET_MOST_RECENT', mostRecent)
//   },
//   setSummary ({ commit }, summary) {
//     commit('SET_SUMMARY', summary)
//   },
//   setFrequency ({ commit }, freq) {
//     commit('SET_FREQUENCY', freq)
//   }
// }

export default {
  state,
  getters
}
