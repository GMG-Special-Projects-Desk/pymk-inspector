<template>
  <section  class="section main">
    <div class="panel">
    Welcome to the PYMK Inspector!
    This is a tool brought to you by the <span class="name" @click="openSPD"> Special Projects Desk </span> in order to better understand your facebook friend recommendations.
    </div>
    <div v-if="hasCredentials">
        <div v-if="hasData" class="panel">
          The most recent session was <em>{{mostRecent.timestamp | moment("from", true) }} ago</em>.
          In that session <em>{{mostRecent.totalPymk}} people</em> were suggested to you,
          there were <em> {{mostRecent.numNew}} people</em> that the inspector hadn't seen before .
           <span class="name"> <router-link :to="{ path: '/summary' }">Click here for details</router-link> </span>
        </div>
        <div v-else class="panel">
          It looks like the scraper hasn't run yet. To try it out go to the <span class="name"> <router-link :to="{ path: '/settings' }">Inspector settings</router-link></span> and click on the <em> Run it now </em> button
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
  const {shell} = require('electron')

  export default {
    name: 'main',
    created () {
      this.refreshData()
    },
    methods: {
      openSPD () {
        shell.openExternal('https://specialprojectsdesk.kinja.com/about-the-gizmodo-media-group-special-projects-desk-1792136692')
      },
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
            return this.$storage
              .get(`${this.serviceName}.json`)
              .then((config) => {
                console.log(config)
                return {...config, ...{mostRecent: d[0].timestamp}}
              })
          })
          .then((updatedConfig) => {
            console.log(updatedConfig)
            return this.$storage.set(`${this.serviceName}.json`, updatedConfig)
          })
          .then((d) => {
            console.log(d)
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