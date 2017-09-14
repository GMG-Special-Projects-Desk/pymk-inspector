<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import {ipcRenderer} from 'electron'
  import { mapActions } from 'vuex'
  export default {
    name: 'pymk-inspector',
    created () {
      ipcRenderer.send('get-db')
      ipcRenderer.on('get-db-reply', (e, arg) => {
        this.setDbPath(arg)
      })
    },
    methods: {
      ...mapActions([
        'setDbPath'
      ])
    }
  }
</script>

<style>
  /* CSS */
</style>
