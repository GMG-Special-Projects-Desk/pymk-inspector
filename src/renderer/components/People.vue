<template>
<section class="section">
  <FilterBar/>
  <people-table> </people-table>
 </section>
</template>

<script>
import PeopleTable from './People/PeopleTable'
import FilterBar from './FilterBar'
import {mapGetters, mapActions} from 'vuex'
import {getAll} from '@/db'
export default {

  name: 'People',
  components: {
    PeopleTable,
    FilterBar
  },
  created () {
    getAll('pymk', this.dbPath)
      .then((d) => {
        this.setAllPeople(d)
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
      'setAllPeople'
    ])
  }
}
</script>

<style lang="scss">
</style>