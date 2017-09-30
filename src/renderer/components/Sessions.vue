<template>
<section class="section">
  <FilterBar/>
  <sessions-table> </sessions-table>
 </section>
</template>

<script>
import SessionsTable from './Sessions/SessionsTable'
import FilterBar from './FilterBar'
import {mapGetters, mapActions} from 'vuex'
import {getAll} from '@/db'
export default {

  name: 'Sessions',
  components: {
    SessionsTable,
    FilterBar
  },
  created () {
    getAll('session', this.dbPath)
      .then((d) => {
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