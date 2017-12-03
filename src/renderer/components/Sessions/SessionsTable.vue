<template>
  <section>
  <article class="media" v-for="row in displaySessions">
      <div class="media-content">
        <div class="content">
            <h5> {{row.timestamp | moment("MMM Do YYYY, h:mmA") }} </h5>
             <span class="name" @click="seePeopleFromSession(row)"> {{row.totalPymk}} {{row.totalPymk === 1 ? 'person' : 'people'}}</span> were suggested,
             <span class="name" @click="newFromSession(row)"> {{row.numNew}} new</span> and
             <span class="name" @click="noMutualFromSession(row)"> {{row.numNoMutual}} {{row.numNoMutual === 1 ? 'person' : 'people'}} with no mutual friends</span>.
        </div>
      </div>
    </article>
  </section>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {getPymkById, getSessionNoMutual, getSessionNew} from '@/db'
var {remote} = require('electron')
const app = remote.app

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
      'allSessions',
      'dbPath',
      'allPeople'
    ])
  },
  methods: {
    seePeopleFromSession (row) {
      this.setCurrentSession(row)
      getPymkById({dbPath: this.dbPath, ids: row.pymkIds})
        .then((people) => {
          this.setSessionFbids(people)
          this.$router.push({name: 'sessions-people'})
        })
        .catch((err) => {
          app.log.error(`error seePeopleFromSession: ${err}`)
        })
    },
    noMutualFromSession (row) {
      this.setCurrentSession(row)
      getSessionNoMutual({dbPath: this.dbPath, timestamp: row.timestamp, numNoMutual: row.numNoMutual})
        .then((people) => {
          if (people.length > 0) {
            this.setSessionFbids(people)
            this.$router.push({name: 'sessions-people'})
          }
        })
        .catch((err) => {
          app.log.error(`[sessions-table] noMutualFromSession: ${err}`)
        })
    },
    newFromSession (row) {
      this.setCurrentSession(row)
      getSessionNew({dbPath: this.dbPath, timestamp: row.timestamp})
        .then((people) => {
          if (people.length > 0) {
            this.setSessionFbids(people)
            this.$router.push({name: 'sessions-people'})
          }
        })
        .catch((err) => {
          app.log.error(`[sessions-table] newFromSession: ${err}`)
        })
    },
    ...mapActions([
      'setSessionFbids',
      'setCurrentSession'
    ])
  }
}
</script>

<style lang="scss">
</style>
