<template>
<section class="section">
  <FilterBar/>
  <sessions-table v-if="this.$route.name === 'sessions'"> </sessions-table>
  <session-people-table v-if="this.$route.name === 'sessions-people'"> </session-people-table>
 </section>
</template>

<script>
import SessionsTable from './Sessions/SessionsTable'
import SessionPeopleTable from './Sessions/SessionPeopleTable'
import FilterBar from './FilterBar'
import {mapGetters, mapActions} from 'vuex'
import {getAll} from '@/db'
export default {

  name: 'Sessions',
  components: {
    SessionsTable,
    SessionPeopleTable,
    FilterBar
  },
  created () {
    getAll('session', this.dbPath)
      .then((d) => {
        // this._.sortBy(d, [function (o) { return o.timestamp.getTime() }])
        this.setAllSessions(d)
      })
  },
  computed: {
    ...mapGetters([
      'summary',
      'dbPath'
    ])
  },
  methods: {
    ...mapActions([
      'setAllSessions'
    ])
  }
}
</script>

<style lang="scss">
</style>