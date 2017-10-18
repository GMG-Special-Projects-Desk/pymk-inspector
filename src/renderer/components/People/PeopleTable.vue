<template>
  <section>
  <article class="media" v-for="row in displayPeople">
    <figure class="media-left">
      <p class="image">
        <img style="max-width: 100px;" v-if="row.imgSrc" :src="row.imgSrc">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <strong class="name" @click="open(row.url)">{{row.name}} </strong>
          <br>
          <small v-if="row.job">{{row.job}} </small>
          <br>
          <span class="details">
          They have been suggested to you
          <b-tooltip
              multilined="true"
              :label="`${row.sessions.map((t) => {
                  return new Date(t).toLocaleDateString()
                })}`"
            type="is-dark"
            position="is-top">
          <em class='data-hover'>
            {{row.sessions.length}} {{row.sessions.length === 1 ? 'time' : 'times'}}
          </em>
        </b-tooltip>
          and were first seen on <em> {{row.created | moment("MMM Do YYYY") }}
          </em> and you have <em> {{row.mutualFriends}} mutual friends </em>.
        </span>
        </p>
      </div>
    </div>
  </article>
</section>
</template>
<script>
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
      sortKey: 'mutualFriends',
      filterKey: '',
      sortOrders: sortOrders,
      reverse: false
    }
  },
  mounted () {
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
    displayPeople: function () {
      if (this.filteredPeople.length > 0) {
        return this.filteredPeople
      } else {
        return this.allPeople
      }
    },
    ...mapGetters([
      'dbPath',
      'filteredPeople',
      'allPeople'
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
