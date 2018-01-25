<template>
  <section  class="section main">
    <div class="panel-top">
      <a @click="setShouldRefresh(true)"><b-icon icon="refresh"> </b-icon> </a>
    </div>
    <div class="panel">
    Welcome to the PYMK Inspector!
    This tool is a part of an <span class="name"> <a @click="openSPD">investigation </a> </span> by Gizmodo's Special Projects Desk. It will help you better understand your Facebook friend recommendations. <span class="name"> <router-link :to="{ path: '/privacy' }">Privacy policy</router-link></span>
    </div>
    <div v-if="hasData">
        <div v-if="hasData" class="panel">
          The most recent session was <em>{{mostRecent.timestamp | moment("from", true) }} ago</em>.
           <span class="name"> <router-link :to="{ path: '/summary' }">Click here for details</router-link> </span>
        </div>
        <div v-else class="panel">
          It looks like the scraper hasn't run yet. To try it out go to the <span class="name"> <router-link :to="{ path: '/settings' }">Inspector settings</router-link></span> and click on the <em> Run it now </em> button
        </div>
        <div class="panel">
          <span class="name"> <router-link :to="{ path: '/settings' }">Inspector settings</router-link></span>
        </div>
        <div @click="quit()" class="panel">
          <span class="name"> <a> Quit Inspector </a> </span>
        </div>
    </div>
    <div v-else>
      <div class="panel">
        It looks like this is either your first time or you don't have any data stored.
        Click on inspector settings to run this app.
      </div>
      <div class="panel">
        <span class="name">
          <router-link :to="{ path: '/settings' }">
            Inspector Settings
          </router-link>
        </span>
      </div>
      <div @click="quit()" class="panel">
        <span class="name"> Quit Inspector</span>
      </div>
    </div>
  </section>
</template>

<script>
  import {ipcRenderer} from 'electron'
  import {mapGetters, mapActions} from 'vuex'
  const {shell} = require('electron')

  export default {
    name: 'main',
    created () {
      this.setShouldRefresh(true)
    },
    methods: {
      openSPD () {
        shell.openExternal('https://gizmodo.com/tag/people-you-may-know')
      },
      quit () {
        ipcRenderer.send('quit-app')
      },
      ...mapActions([
        'setSummary',
        'setMostRecent',
        'setShouldRefresh'
      ])
    },
    computed: {
      ...mapGetters([
        'hasCredentials',
        'hasData',
        'shouldRefresh',
        'hasData',
        'dbPath',
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