<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="electron-vue">
    <main>
      <div class="left-side">
        <div class="doc">
          <button @click="test()">Find</button><br><br>
          <button @click="testSave(dummy)">Save </button><br><br>
        </div>
        <system-information></system-information>
      </div>

      <div class="right-side">
        <div class="doc">
          <div class="title">Welcome to the People You May Know Inspector</div>
          <p v-if="hasCredentials">
              You've already saved your credentials. You're good to go.<button class="alt" @click="open()">Run Nightmare😱</button>
              <button @click="() => {this.$router.push({path: 'credentials'})}">Settings</button><br><br>
          </p>
          <p v-else>
              Looks like this is your first time using the app or there are no credentials stored. <button ><router-link :to="{ path: '/credentials' }">Save Credentials</router-link></button><br><br>
              <button @click="() => {this.$router.push({path: 'credentials'})}">Settings</button><br><br>

          </p>

        </div>

      </div>
    </main>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import keytar from 'keytar'
  import { run } from '@/scripts/scrape'
  import { parsePymk } from '@/scripts/parse'
  import { Doc } from '@/db'
  import { Dummy } from '../../../test-db.js'
  import vo from 'vo'

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    data () {
      return {
        serviceName: 'pymkinspector',
        hasCredentials: false,
        username: '',
        password: '',
        db: Doc
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
        vo(run)({username: this.username, password: this.password}, function (err, result) {
          console.log(err)
          console.log(parsePymk(result))
        })
      },
      test () {
        this.db.find({}, (err, docs) => {
          if (err) {
            console.log(err)
          }
          console.log(docs)
        })
      },
      testSave () {
        console.log(Dummy)
        this.db.save(Dummy.data, (err, docs) => {
          if (err) {
            console.log(err)
          }
          console.log(docs)
        })
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
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

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
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
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
    font-size: .8em;
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
