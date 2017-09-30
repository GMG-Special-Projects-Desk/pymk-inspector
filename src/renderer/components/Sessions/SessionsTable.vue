<template>
  <section>
  <article class="media" v-for="row in displaySessions">
      <div class="media-content">
        <div class="content">
            <h5> {{row.timestamp | moment("MMM Do YYYY, h:mmA") }} </h5>
             <mark> {{row.totalPymk}} people</mark>  were suggested,
             <mark> {{row.numNew}} {{row.numNew === 1 ? 'person' : 'people'}}</mark> of them {{row.numNew === 1 ? 'was' : 'were'}} new and
             <mark> {{row.numNoMutual}} {{row.numNoMutual === 1 ? 'person' : 'people'}}</mark>
              had no mutual friends.
             <br>
            <span class="name"> See the list </span>
        </div>
      </div>
    </article>
  </section>
</template>

<script>
import {getAll} from '@/db'
import {mapGetters} from 'vuex'

export default {
  name: 'SessionsTable',
  computed: {
    displaySessions: function () {
      if (this.filteredSessions.length > 0) {
        return this.filteredSessions
      } else {
        return this.allSessions
      }
    },
    ...mapGetters([
      'filteredSessions',
      'allSessions'
    ])
  }
}
</script>

<style lang="scss">
</style>
