<template>
  <div id="app">
    <top-bar></top-bar>
    <router-view></router-view>
    <bottom-bar v-if="['sessions', 'settings'].indexOf($route.name) < 0" ></bottom-bar>
  </div>
</template>

<script>
  import {ipcRenderer} from 'electron'
  import { mapActions } from 'vuex'
  import {getSummary, getMostRecentSession, updateDB} from '@/db'
  import TopBar from './components/TopBar'
  import BottomBar from './components/BottomBar'
  import keytar from 'keytar'
  export default {
    name: 'pymk-inspector',
    data () {
      return {
        serviceName: 'pymkinspector'
      }
    },
    components: {
      TopBar,
      BottomBar
    },
    mounted () {
      ipcRenderer.on('async-reply', (event, arg) => {
        this.setDbPath(arg.dbPath)
        console.log('Scrape Complete!')
        updateDB({dbPath: arg.dbPath, data: arg.data})
          .then((d) => { console.log('done') })
          .catch(err => { console.log(err) })
        getSummary(arg.dbPath)
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
      })
    },
    created () {
      this.$storage.isPathExists(`${this.serviceName}.json`)
        .then(itDoes => {
          if (itDoes) {
            this.$storage
              .get(`${this.serviceName}.json`)
              .then((d) => {
                if (d.username) {
                  this.hasCredentials = false
                  this.setCredentials(d.username)
                  return d
                } else {
                  console.log('Coundnt find username')
                }
              })
              // .then((d) => { keytar.getPassword(this.serviceName, d.username).then((t) => { this.password = t }) })
          } else {
            // this.hasCredentials = false
          }
        })
      ipcRenderer.send('get-db')
      ipcRenderer.on('get-db-reply', (e, arg) => {
        this.setDbPath(arg)
        getSummary(arg)
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
      })
    },
    methods: {
      ...mapActions([
        'setDbPath',
        'setCredentials',
        'setMostRecent',
        'setSummary'
      ])
    }
  }
</script>

<style lang="scss">
// @import '~wysiwyg.css/wysiwyg.sass';

body {
  height: 480px;
}

</style>
