const state = {
  pymkFilters: [
    { value: 'name', text: 'Name' },
    { value: 'mutualFriends', text: 'Number of mutual friends' },
    { value: 'created', text: 'First suggested' },
    { value: 'fbid', text: 'Facebook Id' },
    { value: 'job', text: 'Work ' },
    { value: 'sessions', text: 'Number of times suggested ' }
  ],
  sessionFilters: [
    { value: 'timestamp', text: 'Date' },
    { value: 'totalPymk', text: 'Number of people suggested' },
    { value: 'numNoMutual', text: 'Number of mutual friends' },
    { value: 'numSeenBefore', text: 'Number of times suggested' },
    { value: 'numNew', text: 'Sessions with new suggestions' }
  ]
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
