<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="electron-vue">
    <main>

      <div class="right-side">
        <div class="doc">
          <div class="title"></div>
          {{err ? 'Err' : 'Store your credentials'}}

        </div>
        <div class="doc">
          <input v-model="username" placeholder="username">
          <input type="password" v-model="password" placeholder="password"><br><br>
          <button @click="save()">Save credentials</button>
          <button @click="del()">Delete credentials</button><br><br>
          <button @click="() => {this.$router.push({ path: '/' })}">Home</router-link></button><br><br>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import keytar from 'keytar'
  export default {
    name: 'landing-page',
    components: { SystemInformation },
    created () {
      this.$storage.isPathExists(`${this.serviceName}.json`)
        .then(itDoes => {
          if (itDoes) {
            this.hasCredentials = true
            this.$storage
              .get(`${this.serviceName}.json`)
              .then((d) => { this.username = d.username; return d })
          } else {
            this.hasCredentials = false
          }
        })
    },
    data () {
      return {
        serviceName: 'pymkinspector',
        username: '',
        password: '',
        err: false,
        keytar: keytar
      }
    },
    methods: {
      save () {
        if (this.username.length > 0 && this.password.length > 0) {
          this.keytar.setPassword(this.serviceName, this.username, this.password)
          this.err = false
          this.$storage
            .set(`${this.serviceName}.json`, {username: this.username})
            .then((d) => { console.log('username stored') })
            .catch((err) => { console.log(`Err: username not stored ${err}`) })
          this.username = ''
          this.password = ''
        } else {
          this.err = true
        }
      },
      del () {
        this.keytar.findPassword(this.serviceName).then((x) => { console.log(x) })
      },
      goBack () {
        this.$route.push('landing-page')
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
