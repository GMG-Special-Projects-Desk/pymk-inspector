<template>
<section class="section">
    <div class="panel-top">
      <a> <router-link :to="{ path: '/summary' }">Go Back</router-link></a>
    </div>
    <div>
    <people-table> </people-table>
    </div>
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
</style>