<template>
  <div id="app">
    <nav class="level">
    <div class="level-item">
         <img id="logo" src="~@/assets/facebook-inspector.svg" alt="electron-vue" width="60" height="60" >
    </div>
    </nav>
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

<style>
@import '~bulma';
.level {
  border-color: #292929;
  margin-bottom: 0px;
  /*background-color: #;*/
}
#logo {
  /*margin-right: 150px;*/
}
</style>
