<template>
  <section>
  <article class="media" v-for="row in displaySessions">
      <div class="media-content">
        <div class="content">
            <h5> {{row.timestamp | moment("MMM Do YYYY, h:mmA") }} </h5>
             <mark> {{row.totalPymk}}</mark> were suggested,
             <mark @click="newFromSession(row)"> {{row.numNew}} {{row.numNew === 1 ? 'person' : 'people'}}</mark> of them {{row.numNew === 1 ? 'was' : 'were'}} new and
             <mark @click="noMutualFromSession(row)"> {{row.numNoMutual}} {{row.numNoMutual === 1 ? 'person' : 'people'}}</mark>
              had no mutual friends.
             <br>
            <span @click="seePeopleFromSession(row)" class="name"> See the list </span>
        </div>
      </div>
    </article>
  </section>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {getPymkById, updateSessionDbNoMutual, getSessionNew} from '@/db'
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
      console.log({dbPath: this.dbPath, ids: row.pymkIds})
      getPymkById({dbPath: this.dbPath, ids: row.pymkIds})
        .then((people) => {
          console.log(people)
          this.setSessionFbids(people)
          this.$router.push({name: 'sessions people'})
        })
        .catch((err) => {
          console.log(`error seePeopleFromSession: ${err}`)
        })
    },
    noMutualFromSession (row) {
      console.log(row)
      updateSessionDbNoMutual(this.dbPath)
        .then((result) => {
          console.log(result)
        })
        .catch((err) => {
          console.log(`error: updateSessionDbNoMutual: ${err}`)
        })
      // getSessionNoMutual({dbPath: this.dbPath, timestamp: row.timestamp, numNoMutual: row.numNoMutual})
      //   .then((people) => {
      //     console.log(people)
      //   })
      //   .catch((err) => {
      //     console.log(`error: noMutualFromSession: ${err}`)
      //   })
    },
    newFromSession (row) {
      getSessionNew({dbPath: this.dbPath, timestamp: row.timestamp})
        .then((people) => {
          console.log(people)
        })
        .catch((err) => {
          console.log(`error newFromSession: ${err}`)
        })
    },
    ...mapActions([
      'setSessionFbids'
    ])
  }
}
</script>

<style lang="scss">
</style>
