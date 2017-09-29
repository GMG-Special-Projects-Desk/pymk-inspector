<template>
  <section>
  <article class="media" v-for="row in allSessions">
      <div class="media-content">
        <div class="content">
            <h5> {{row.timestamp | moment("MMM Do YYYY, h:mA") }} </h5>
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
  data () {
    return {
      allSessions: [
      ],
      selected: []
    }
  },
  mounted () {
    getAll('session', this.dbPath)
      .then((d) => { this.allSessions = d; this.selected = d[0] })
      .catch(err => { console.log(err) })
  },
  computed: {
    ...mapGetters([
      'dbPath'
    ])
  }
}
</script>

<style lang="scss">
</style>
