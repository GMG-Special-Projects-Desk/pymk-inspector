<template>
<section class="section">
    <FilterBar/>
    <!-- <div class="panel-top">
    <a> <router-link :to="{ path: '/summary' }">Go Back</router-link></a>
    </div> -->
    <sessions-table> </sessions-table>
 </section>
</template>

<script>
import SessionsTable from './Sessions/SessionsTable'
import FilterBar from './FilterBar'
import {mapGetters} from 'vuex'
export default {

  name: 'Sessions',
  components: {
    SessionsTable,
    FilterBar
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'summary'
    ])
  }
}
</script>

<style lang="scss">
</style>