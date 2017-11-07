<template>
    <div class="panel-top">
      <b-field class="filterbar" expanded group-multiline>
              <p class="control">
                <a @click="setShouldRefresh(true)"><b-icon icon="refresh"> </b-icon> </a>
              </p>
              <p class="control">
              <b-tooltip label="Select sort key"
                  type=""
                  size="is-danger"
                  position="is-right">
                <b-dropdown v-model="sortKey">
                      <button class="button" slot="trigger">
                          <span>Sort</span>
                          <b-icon icon="arrow_drop_down"></b-icon>
                      </button>
                    <b-dropdown-item
                      @click="sortButton()"
                      v-for="f in filter"
                      :key="f.value"
                      :value="f">
                        {{f.text}}
                      </b-dropdown-item>
                </b-dropdown>
               </b-tooltip>
            </p>
            <p class="control">
                <b-tooltip :label="sortOrder ? 'Display data in ascending order' :'Display data in descending order'"
                    type=""
                    size="is-danger"
                    position="is-right">
                <button @click="sortButton()" class="button">
                  <b-icon size="is-medium" :icon="sortOrder  ? 'arrow_upward' : 'arrow_downward' "> </b-icon>
                </button>
              </b-tooltip>
            </p>
            <b-input
              v-model="filterKey"
              v-if="$route.name === 'people'"
              style="width: 100%;"
              icon="search"
              type="search"
              placeholder="Name or work">
            </b-input>
            <b-field
              v-else
              label=""
              style="width:100%; text-align: center;">
            </b-field>
            <p class="control">
              <span class="button">
                <router-link :to="{ path: '/summary' }"> Go Back</router-link>
              </span>
            </p>
        </b-field>
        <b-collapse :open.sync="isOpen">
            <div class="notification">
                <div class="content">
                  <span v-if="this.$route.name !== 'sessions-people'"> Sorting by {{this.sortText}}.</span>
                  <span v-if="this.$route.name === 'people'">Displaying {{filteredTotal}} of {{allTotal}} </span>
                  <span v-if="this.$route.name === 'sessions-people'"> Displaying {{sessionFbids.length}} of {{currentSession.totalPymk}}</span>

                </div>
            </div>
        </b-collapse>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  name: 'FilterBar',
  data () {
    return {
      sortKey: '',
      sortText: '',
      isOpen: true,
      sortOrder: true,
      filterKey: ''
    }
  },
  created () {
    this.sortKey = this.filter[0]
    const data = this.getCurrentData()
    const sortedData = this.sortData(data, this.sortKey)
    this.setData(sortedData)
    this.sortText = 'Name'
  },
  watch: {
    sortKey (value) {
      const data = this.getCurrentData()
      const sortedData = this.sortData(data, value.value)
      this.setData(sortedData)
      this.sortText = value.text
    },
    filterKey (value) {
      const filtered = this.filterData(value)
      const sortedData = this.sortData(filtered, this.sortKey)
      this.setData(sortedData)
    }
  },
  methods: {
    sortButton () {
      this.sortOrder = !this.sortOrder
      const data = this.getCurrentData()
      const sortedData = this.sortData(data, this.sortKey)
      this.setData(sortedData)
    },
    getCurrentData () {
      if (this.$route.name === 'sessions') {
        return this.filteredSessions.length > 0 ? this.filteredSessions : this.allSessions
      } else {
        return this.filteredPeople.length > 0 ? this.filteredPeople : this.allPeople
      }
    },
    sortData (data, sk) {
      const sortKey = sk
      const order = this.sortOrder ? 1 : -1
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = sortKey.value === 'sessions' ? a[sortKey.value].length : a[sortKey.value]
          b = sortKey.value === 'sessions' ? b[sortKey.value].length : b[sortKey.value]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    },
    filterData (fk) {
      let data = this.allPeople
      const filterKey = fk && fk.toLowerCase()
      if (this.$route.name === 'people' && filterKey) {
        data = data.filter(function (row) {
          return ['name', 'job'].some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      return data
    },
    setData (data) {
      this.$route.name === 'sessions' ? this.setFilteredSessions(data) : this.setFilteredPeople(data)
    },
    ...mapActions([
      'setFilteredPeople',
      'setFilteredSessions',
      'setShouldRefresh'
    ])
  },
  computed: {
    filter () {
      if (this.$route.name === 'people') {
        return this.pymkFilters
      } else {
        return this.sessionFilters
      }
    },
    allTotal () {
      return this.$route.name === 'sessions' ? this.allSessions.length : this.allPeople.length
    },
    filteredTotal () {
      const currentData = this.getCurrentData()
      return currentData.length
    },
    ...mapGetters([
      'pymkFilters',
      'sessionFilters',
      'sessionFbids',
      'currentSession',
      'allSessions',
      'filteredSessions',
      'allPeople',
      'filteredPeople'
    ])
  }
}
</script>

<style lang="scss" scoped>
.filterbar {
  margin-bottom: 0px;
}

</style>