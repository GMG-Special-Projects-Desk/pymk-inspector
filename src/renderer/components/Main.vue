<template>
  <section  class="section main">
    <div v-if="hasCredentials">
        <div v-if="hasData" class="panel">
          The most recent session was <mark>{{mostRecent.timestamp | moment("from", true) }} ago</mark>.
          In that session <mark>{{mostRecent.totalPymk}} people</mark> were suggested to you,
          there were <mark> {{mostRecent.numNew}} people</mark> that the inspector hadn't seen before .
           <span class="name"> <router-link :to="{ path: '/summary' }">Details</router-link> </span>
        </div>
        <div v-else class="panel">
          It looks like the scraper hasn't run yet. To try it out go to the <span class="name"> <router-link :to="{ path: '/settings' }">Inspector settings</router-link></span> and click on the <mark> Run it now </mark> button
        </div>
        <div class="panel">
          <p> Current user: {{username}}</p>
          <p> Total sessions : {{summary.sessionCount}}</p>
        </div>
        <div class="panel">
          <span class="name"> <router-link :to="{ path: '/settings' }">Inspector settings</router-link></span>
        </div>
        <div @click="quit()" class="panel">
          <span class="name"> Quit Inspector</span>
        </div>
    </div>
    <div v-else>
      <div class="panel">
        Welcome to the People You May Know Inspector!
      </div>
      <div class="panel">
        It looks like this is either your first time or you don't have your credentials stored.
        Please go to settings to add your Facebook credentials.
        These are stored in your computer's keychain and never recorded or directly read by this app.
      </div>
      <div class="panel">
        <span class="name"> <router-link :to="{ path: '/settings' }">Inspector settings</router-link></span>
      </div>
      <div @click="quit()" class="panel">
        <span class="name"> Quit Inspector</span>
      </div>
    </div>
  </section>
</template>

<script>
  import {ipcRenderer} from 'electron'
  import {getSummary, getMostRecentSession} from '@/db'
  import {mapGetters, mapActions} from 'vuex'
  export default {
    name: 'main',
    created () {
      this.refreshData()
    },
    methods: {
      quit () {
        ipcRenderer.send('quit-app')
      },
      refreshData () {
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
      },
      ...mapActions([
        'setSummary',
        'setMostRecent'
      ])
    },
    computed: {
      ...mapGetters([
        'hasCredentials',
        'hasData',
        'dbPath',
        'username',
        'serviceName',
        'summary',
        'mostRecent',
        'dbPath'
      ])
    }
  }
</script>

<style lang='scss'>
</style>