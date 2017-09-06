<template>
  <div id="wrapper">
      <div class="title">  People You May Know Inspector
          <img id="logo" src="~@/assets/facebook-inspector.svg" alt="electron-vue">
          <button @click="quit()">Quit</button><br><br>
      </div>
    <main>
        <div class="doc">
          <p v-if="hasCredentials">
              You've already saved your credentials. You're good to go.<button class="alt" @click="open()">Run Nightmare😱</button>
              <button @click="() => {this.$router.push({path: 'credentials'})}">Settings</button><br><br>
          </p>
          <p v-else>
              Looks like this is your first time using the app or there are no credentials stored. <button ><router-link :to="{ path: '/credentials' }">Save Credentials</router-link></button><br><br>
              <button @click="() => {this.$router.push({path: 'credentials'})}">Settings</button><br><br>
          </p>
          <button @click="test()">Schedule</button><br><br>
          <button @click="getNext()">Get Next</button> <span v-if='nextJob'>{{nextJob}}</span><br><br>
          <button @click="testSave(dummy)">Save </button><br><br>
        </div>
    </main>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import keytar from 'keytar'
  import Nightmare from 'nightmare'
  import { vo } from 'vo'
  import { run } from '@/scripts/scrape'
  import { setCronJob } from '@/scripts/utils'
  import { Dummy } from '../../../test-db.js'
  import moment from 'moment'
  const app = require('electron').remote.app

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    data () {
      return {
        serviceName: 'pymkinspector',
        nightmare: Nightmare({ electronPath: require('electron-nightmare'),
          show: true}),
        hasCredentials: false,
        username: '',
        password: '',
        db: {},
        cronJob: null,
        nextJob: ''
      }
    },
    created () {
      this.$storage.isPathExists(`${this.serviceName}.json`)
        .then(itDoes => {
          if (itDoes) {
            this.hasCredentials = true
            this.$storage
              .get(`${this.serviceName}.json`)
              .then((d) => { this.username = d.username; return d })
              .then((d) => { keytar.getPassword(this.serviceName, d.username).then((t) => { this.password = t }) })
          } else {
            this.hasCredentials = false
          }
        })
    },
    methods: {
      open () {
        runScrape({username: this.username, password: this.password}, this.parse, true)
        const nightmare = Nightmare({
          show: displayBrowser,
          electronPath: require('electron-nightmare')
        })
        console.log(nightmare)
        vo(run)(creds, function (err, result) {
          if (err) {
            console.log(err)
          } else {
            const pymk = parsePymk(result)
            console.log(`Complete with ${pymk.length} pymk`)
            cb(pymk)
          }
        })
      },
      test () {
        this.cronJob = setCronJob(() => { console.log('job') })
      },
      testSave () {
        this.db.save(Dummy.data, (err, docs) => {
          if (err) {
            console.log(err)
          }
          console.log(docs)
        })
      },
      getNext () {
        if (this.cronJob) {
          // const now = moment()
          const next = moment(this.cronJob.nextInvocation())
          // const ms = now.diff(next, 'hours')
          // console.log(ms)
          console.log(next)
          this.nextJob = next
          // if (now.isBefore(next)) {
          //   this.nextJob = 'now is before next'
          // } else {
          //   this.nextJob = 'now is after next'
          // }
        } else {
          return false
        }
      },
      parse (results) {
        console.log(results)
      },
      quit () {
        app.quit()
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 10px 10px;
    width: 100vw;
  }

  #logo {
    height: auto;
    width: 32px;
    float: right;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  /*main > div { flex-basis: 50%; }*/
  main > div { flex-basis: 100%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 25px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .6em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>
