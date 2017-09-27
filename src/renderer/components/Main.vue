<template>
  <section>
    <div v-if="hasCredentials" class="section">
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
        <router-link :to="{ path: '/settings' }">Inspector settings</router-link>
      </div>
    </div>
    <div v-else class="main">
      <h2> Facebook's People You May Know Inspector </h2>
      <p> It looks like this is either your first time or you don't have your credentials stored.</p>
      <p> Please go to the setting page to add your Facebook credentials.</p>
      <p>These are stored in your computers keychain and never recorded or directly read by this app.</p>
      <a> <router-link :to="{ path: '/settings' }">Inspector settings</router-link></a>
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
      // getMostRecentSession(this.dbPath)
      //   .then((d) => { console.log(d); this.recentSession = d[0] })
      //   .catch(err => { console.log(err) })
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
// @import '~bulma';

.main{
  overflow: hidden;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 420px;
  margin-top:60px;
}

</style>