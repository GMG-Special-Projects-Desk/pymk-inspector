const state = {
  pymkFilters: [
    { value: 'name', text: 'Name' },
    { value: 'mutualFriends', text: 'Number of mutual friends' },
    { value: 'created', text: 'First seen' },
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

export default {
  state,
  getters
}
