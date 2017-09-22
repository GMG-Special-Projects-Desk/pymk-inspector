<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import {ipcRenderer} from 'electron'
  import { mapActions } from 'vuex'
  import keytar from 'keytar'
  export default {
    name: 'pymk-inspector',
    data () {
      return {
        serviceName: 'pymkinspector'
      }
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
      })
    },
    methods: {
      ...mapActions([
        'setDbPath',
        'setCredentials'
      ])
    }
  }
</script>

<style lang="scss">
@import '~wysiwyg.css/wysiwyg.sass';

body {
  height: 480px;
}

</style>
