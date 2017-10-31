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

$grey-blue: #8DA7BE;
$grey-blue-invert: findColorInvert($grey-blue);
$sea-green-blue: #BBE5ED;
$sea-green-blue-invert: findColorInvert($sea-green-blue);
$light-blue: #5F82CA;
$light-blue-invert: findColorInvert($light-blue);
$dark-blue: #405D9E;
$dark-blue-invert: findColorInvert($light-blue);
$pink: #FF006E;
$pink-invert: findColorInvert($pink);



$info: $light-blue;
$info-invert: $light-blue-invert;

$primary: #FFA630;
$primary-invert: findColorInvert($primary);
$mark-color: $cyan;
$link: $red;
$link-invert: $red-invert;
$link-focus-border: $red;
$background: $white-ter;
$footer-color: $yellow;
$panel-background: $white;
$hover-background: $red;
$media-background: $white;
$notification-background: $light-green;
$notification-color: $light-green-invert;

$primary: $dark-blue; //#FFA630;
$primary-invert: findColorInvert($primary);
$mark-color: $cyan;
$link: $pink;
$link-invert: $pink-invert;
$link-focus-border: $red;
$background: $sea-green-blue;
$footer-color: $grey-blue;
$panel-background: $white;
$hover-background: $pink;
$media-background: $white;
$notification-background: $light-blue;
$notification-color: $light-blue-invert;
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
);

// Links



// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
mark {
  background-color: $mark-color;
}

body {
  height: 480px;
  background-color: $background;
}
em {
  font-weight: 600;
}
.name:hover {
  background-color: $hover-background;
  cursor: pointer;
}

.data-hover {
  border-bottom-style: dashed;
  border-bottom-width: 1px;
  border-bottom-color: $link;
  // text-decoration-style: dashed;
}
.data-hover:hover {
  background-color: $hover-background;
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
.section.summary {
  padding-top:100px;
}
.section.settings {
  padding-top:100px;
}
.section.main {
  padding-top:80px;
}
//by panel i really mean container
.panel {
  background-color: $panel-background;
  padding: 0.5rem 0.5rem;
  border: solid;
  border-width: 1px;
  border-radius: 10px;
}

.panel-top {
  background-color: $panel-background;
  border-width: thin;
  border-style: dashed;
  border-top-width: 0;
  position: fixed;
  z-index: 999;
  width: 100%;
  top: 59px;
  left: 0px;
}
.media + .media {

  border: solid;
  border-width: 1px;
  border-radius: 10px;
}
.media {
  background-color: $media-background;
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
  background-color: $footer-color;
}

.footer-text {
  font-size: 0.8em;
}

.notification {
  padding: 0.25rem 0.5rem 0.25rem 0.5rem;
  font-size: 0.8em;
  background-color : $notification-background;
  color: $notification-color;
}
</style>
