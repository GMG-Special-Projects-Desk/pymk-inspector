<template>
  <section>
  <article class="media" v-for="row in filteredPeople">
    <figure class="media-left">
      <p class="image">
        <img style="max-width: 100px;" v-if="row.imgSrc" :src="row.imgSrc">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <strong class="name" @click="open(row.url)">{{row.name}} </strong>
          <small v-if="row.job"> Works at {{row.job}} </small>
          <br>
          <span class="details">
          They have been suggested to you <mark> {{row.sessions.length}} {{row.sessions.length === 1 ? 'time' : 'times'}}
          </mark> and were first seen on <mark> {{row.created | moment("MMM Do YYYY") }}
          </mark> and you have <mark> {{row.mutualFriends}} mutual friends </mark>.
        </span>
        </p>
      </div>
    </div>
  </article>
</section>
</template>
<script>
import {getAll} from '@/db'
import {mapGetters} from 'vuex'
const {shell} = require('electron')

export default {
  name: 'PeopleTable',
  data () {
    const columns = ['mutualFriends', 'created', 'name']
    const sortOrders = {}
    columns.forEach(function (key) {
      sortOrders[key] = -1
    })
    return {
      allPeople: [],
      sortKey: 'mutualFriends',
      filterKey: '',
      sortOrders: sortOrders,
      reverse: false
    }
  },
  mounted () {
    getAll('pymk', this.dbPath)
      .then((d) => { this.allPeople = d })
      .catch(err => { console.log(err) })
  },
  methods: {
    open (url) {
      shell.openExternal(url)
    },
    sendTip () {
      shell.openExternal('https://specialprojectsdesk.kinja.com/about-the-gizmodo-media-group-special-projects-desk-1792136692')
    },
    filterByIds (current) {
      return this.allPeople.filter((p) => {
        return current.indexOf(p.fbid) > -1
      })
    }
  },
  computed: {
    filteredPeople: function () {
      const sortKey = this.sortKey
      const filterKey = this.filterKey && this.filterKey.toLowerCase()
      const order = this.sortOrders[sortKey] || 1
      let data = this.allPeople
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    },
    ...mapGetters([
      'dbPath'
    ])
  }
}
</script>

<style lang="scss">
$striped-rows: true;

.details {
  font-size: 0.8rem;
}

.tips {
  font-size: 0.7em;
  float: right;
}

</style>
