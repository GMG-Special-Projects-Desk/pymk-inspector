<template>
  <div id="app">
    <top-bar></top-bar>
    <router-view></router-view>
    <bottom-bar></bottom-bar>
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
                  this.setCredentials(d.username)
                } else {
                  console.log('Coundnt find username')
                }
                if (d.frequency) {
                  this.setFrequency(d.frequency)
                  console.log(`Setting frequency to ${d.frequency}`)
                } else {
                  console.log('Didnt find frequency settings. Setting default')
                }
                return d
              })
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
        'setFrequency',
        'setMostRecent',
        'setSummary'
      ])
    }
  }
</script>

<style lang="scss">
// Import Bulma's core
@import "~bulma/sass/utilities/_all";


$red: #F25F5C;
$red-invert: findColorInvert($red);
$cyan: #ADFCF9;
$blue: #247BA0;
$blue-invert: findColorInvert($blue);
$green: #70C1B3;
$light-green: #BCE784;
$light-green-invert: findColorInvert($light-green);
$yellow: #FFE066;
$primary: #FFA630;
// // Set your colors
// $primary: #8c67ef;
$primary-invert: findColorInvert($primary);
$twitter: #4099FF;
$twitter-invert: findColorInvert($twitter);
$info: $light-green;
$info-invert: $light-green-invert;
// // Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
    "white": ($white, $black),
    "black": ($black, $white),
    "light": ($light, $light-invert),
    "dark": ($dark, $dark-invert),
    "primary": ($primary, $primary-invert),
    "info": ($info, $info-invert),
    "success": ($success, $success-invert),
    "warning": ($warning, $warning-invert),
    "danger": ($danger, $danger-invert),
    "twitter": ($twitter, $twitter-invert)
);

// Links
$link: $red;
$link-invert: $red-invert;
$link-focus-border: $red;
$background: $white-ter;
// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";

body {
  height: 480px;
  background-color: $background;
}

.panel-top {
  background-color: $white;
  border-width: thin;
  border-style: dashed;
  border-top-width: 0;
  position: fixed;
  z-index: 999;
  width: 100%;
  top: 59px;
  left: 0px;
}

.section {
  background-color: $background;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  min-height: 400px;
  padding-top:100px;
}

.panel {
  background-color: $white;
  padding: 0.5rem 0.5rem;
  border: solid;
  border-width: 1px;
  border-radius: 10px;

}
.media + .media {

  border: solid;
  border-width: 1px;
  border-radius: 10px;
}
.media {
  background-color: $white;
  padding: 0.5rem 0.5rem;
  border: solid;
  border-width: 1px;
  border-radius: 10px;
}
.name {
  border-bottom: dashed;
  border-width: 1px;

}
input {
  border-style: solid;
  // border-
}
.footer {
  padding: 0px;
  width: 100%;
  bottom: 0px;
  left: 0px;
  position: fixed;
  background-color: $yellow;
}

.footer-text {
  font-size: 0.8em;
}

bu
.name:hover {
  background-color: $red;
}
mark {
  background-color: $cyan;
}
</style>
