<template>
<section class="section">
  <FilterBar/>
    <div>
    <people-table> </people-table>
    </div>
 </section>
</template>

<script>
import PeopleTable from './People/PeopleTable'
import {mapGetters} from 'vuex'
import FilterBar from './FilterBar'
export default {

  name: 'People',
  components: {
    PeopleTable,
    FilterBar
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