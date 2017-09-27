<template>
  <section  class="section">
    <div v-if="hasCredentials">
      <div class="panel">
        The most recent session was <mark>{{mostRecent.timestamp | moment("from", true) }} ago</mark>.
        In that session <mark>{{mostRecent.totalPymk}} people</mark> were suggested to you,
        there were <mark>{{mostRecent.numNoMutual}} people with no mutual friends</mark> and
         <mark>{{mostRecent.numNew}} people that the inspector hadn't seen before</mark>.
         <span class="name"> <router-link :to="{ path: '/summary' }">Details</router-link> </span>
      </div>
      <div class="panel">
      <p> Current user: {{username}}</p>
      <p @click="dbGet()"> Total sessions : {{summary.sessionCount}}</p>
      </div>
    <div class="panel">
      <span class="name"> <router-link :to="{ path: '/settings' }">Inspector settings</router-link></span>
    </div>
    </div>
    <div v-else>
      <div class="panel">
        Welcome to the People You May Know Inspector!
      </div>
      <div class="panel">
        It looks like this is either your first time or you don't have your credentials stored.
        Please go to the setting page to add your Facebook credentials.
        These are stored in your computers keychain and never recorded or directly read by this app.
      </div>
      <div class="panel">
        <span class="name"> <router-link :to="{ path: '/settings' }">Inspector settings</router-link></span>
      </div>
    </div>
  </section>
</template>

<script>
  import {getAll, getMostRecentSession, getSummary} from '@/db'
  import {mapGetters} from 'vuex'
  export default {
    name: 'main',
    data () {
      return {
        serviceName: 'pymkinspector'
      }
    },
    mounted () {
    },
    methods: {
      dbGet () {
        getAll('session', this.dbPath)
          .then((d) => { console.log(d) })
          .catch(err => { console.log(err) })
        getAll('pymk', this.dbPath)
          .then((d) => { console.log(d) })
          .catch(err => { console.log(err) })
      },
      refresh () {
        getSummary(this.dbPath)
          .then((data) => {
            this.setSummary(data.current)
            return data.dbPath
          })
          .then(getMostRecentSession)
          .then((d) => {
            this.setMostRecent(d[0])
          })
          .catch((err) => {
            console.log(`err: ${err}`)
          })
      }
    },
    computed: {
      ...mapGetters([
        'hasCredentials',
        'username',
        'summary',
        'mostRecent',
        'dbPath'
      ])
    }
  }
</script>

<style lang='scss'>
</style>