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

  export default {
    name: 'pymk-inspector',
    data () {
      return {
        serviceName: 'pymkinspector'
      }
    },
    watch: {
      '$route' (to, from) {
        // allPeople and allSessions are loaded in their respective components
        if (to.name === 'pymk-inspector' && from.name === 'sessions') {
          this.clearSessions()
        }
        if (to.name === 'pymk-inspector' && from.name === 'people') {
          this.clearPeople()
        }
        if (to.name === 'sessions' && from.name === 'sessions people') {
          this.clearSessionFbids()
        }
      }
    },
    components: {
      TopBar,
      BottomBar
    },
    created () {
      this.initConfig()
      this.initDbStuff()
      this.initUpdateListeners('fg-scrape')
      this.initUpdateListeners('bg-scrape')
    },
    methods: {
      initUpdateListeners (channel) {
        ipcRenderer.on(channel, (event, arg) => {
          if (arg.error) {
            console.log(`There was an error in the scrape! ${arg.error}`)
            return
          }
          console.log(event, arg)
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
              return d
            })
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
              console.log(`completed: ${d}`)
            })
            .catch((err) => {
              console.log(`err: ${err}`)
            })
        })
      },
      initDbStuff () {
        const dbPath = ipcRenderer.sendSync('get-db-path')
        this.setDbPath(dbPath)

        getSummary(dbPath)
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
      initConfig () {
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
            // .then((d) => {
            //   return this.$storage
            //     .get(`${this.serviceName}.json`)
            //     .then((config) => {
            //       console.log(config)
            //       return {...config, ...{mostRecent: d[0].timestamp}}
            //     })
            // })
            // .then((updatedConfig) => {
            //   console.log(updatedConfig)
            //   return this.$storage.set(`${this.serviceName}.json`, updatedConfig)
            // })
            }
          })
      },
      ...mapActions([
        'setDbPath',
        'setCredentials',
        'setAllPeople',
        'setFrequency',
        'setAllSessions',
        'setMostRecent',
        'setSummary',
        'clearSessions',
        'clearPeople',
        'clearSessionFbids'
      ])
    }
  }
</script>

<style lang="scss">
@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: url(http://fonts.gstatic.com/s/materialicons/v29/2fcrYFNaTjcS6g4U3t-Y5UEw0lE80llgEseQY3FEmqw.woff2) format('woff2');
}

.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}
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

.section.summary {
  background-color: $background;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  min-height: 400px;
  padding-top:100px;
}
.section.settings {
  background-color: $background;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  min-height: 400px;
  padding-top:100px;
}
.section.main {
  padding-top:80px;
}

.section {
  background-color: $background;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  min-height: 400px;
  padding-top: 140px;
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

.rounded {
   -webkit-border-radius: 20px;
   -moz-border-radius: 20px;
   border-radius: 20px;
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

.notification {
  padding: 0.25rem 0.5rem 0.25rem 0.5rem;
  font-size: 0.8em;
  background-color : $light-green;
  color: $light-green-invert;
}
.name:hover {
  background-color: $red;
  cursor: pointer;
}
mark {
  background-color: $cyan;
}
</style>
