<template>
<section class="section">
    <div class="panel-top">
      <!-- The inspector has run <mark>{{summary.sessionCount}} times</mark> since
      <mark>{{ summary.startDate | moment("dddd, MMMM Do YYYY") }}.</mark>
      On average per session you were shown <mark>{{summary.avgPymk}} people per session</mark>,
      <mark>{{summary.avgNewPymk}} of whom had not been seen before</mark> and
      <mark>{{summary.avgNoMutualPymk}} with no mutual friends</mark> -->
    <a> <router-link :to="{ path: '/summary' }">Go Back</router-link></a>
    </div>
    <sessions-table> </sessions-table>
 </section>
</template>

<script>
import SessionsTable from './Sessions/SessionsTable'
import {mapGetters} from 'vuex'
export default {

  name: 'Sessions',
  components: {
    SessionsTable
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
.sessions{
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  height: 420px;
  margin-top:60px;
}
</style>