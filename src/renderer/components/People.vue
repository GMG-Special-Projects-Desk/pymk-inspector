<template>
<section class="people">
    <div>
      The inspector has seen <mark> {{summary.pymkCount}} people</mark> since it started running.

    </div>
    <a> <router-link :to="{ path: '/summary' }">Go Back</router-link></a>
    <people-table> </people-table>
 </section>
</template>

<script>
import PeopleTable from './People/PeopleTable'
import {mapGetters} from 'vuex'
export default {

  name: 'People',
  components: {
    PeopleTable
  },
  computed: {
    ...mapGetters([
      'summary'
    ])
  }
}
</script>

<style lang="scss">
.people {
  margin-top: 60px;
}
</style>