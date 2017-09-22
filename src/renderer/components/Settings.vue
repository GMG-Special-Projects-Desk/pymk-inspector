<template>
  <section class="wysiwyg settings">
    <h2> Settings </h2>
    <h3 >Username</h3>
    <input v-model="userNameModel" class="input" type="username"/>


    <h3 >Password</h3>
    <input v-model="passwordModel" class="input" type="password" />


    <h3 >Frequency</h3>
    <input v-model="passwordModel" class="input" type="text" />
    <a> Save Settings </a>
    <a> Delete Settings </a>
    <a @click="scrape()"> Do a test run </a>
    <a> <router-link :to="{ path: '/' }">Go Back</router-link></a>
  </section>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import keytar from 'keytar'
  import { mapGetters, mapActions } from 'vuex'
  import { updateDB } from '@/db'
  var {ipcRenderer} = require('electron')

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    created () {
      this.userNameModel = this.username()
    },
    mounted () {
      ipcRenderer.on('async-reply', (event, arg) => {
        this.setDbPath(arg.dbPath)
        console.log(arg)
        console.log('async-reply')
        updateDB({dbPath: arg.dbPath, data: arg.data})
          .then((d) => { console.log('done') })
          .catch(err => { console.log(err) })
      })
    },
    data () {
      return {
        userNameModel: '',
        passwordModel: '',
        err: false,
        keytar: keytar
      }
    },
    computed: {
      ...mapGetters([
        'username',
        'serviceName'
      ])
    },
    methods: {
      save () {
        if (this.userNameModel.length > 0 && this.passwordModel.length > 0) {
          this.keytar.setPassword(this.serviceName, this.userNameModel, this.passwordModel)
          this.err = false
          this.$storage
            .set(`${this.serviceName}.json`, {username: this.userNameModel})
            .then((d) => {
              this.setCredentials(d.username)
              console.log('username stored')
            })
            .catch((err) => { console.log(`Err: username not stored ${err}`) })
          this.userNameModel = ''
          this.passwordModel = ''
        } else {
          this.err = true
        }
      },
      del () {
        this.keytar.deletePassword(this.serviceName, this.username).then((x) => {
          console.log(x)
        })
        this.$storage
          .set(`${this.serviceName}.json`, {username: ''})
          .then((d) => { console.log('credentials cleared') })
          .catch((err) => { console.log(`Err: credentials not deleted ${err}`) })
      },
      scrape: function () {
        keytar.getPassword(this.serviceName, this.username).then((t) => {
          console.log('t')
          ipcRenderer.send('async', {username: this.username, password: t})
        })
      },
      goBack () {
        this.$route.push('landing-page')
      },
      ...mapActions([
        'setDbPath'
      ])
    }
  }
</script>

<style lang="scss">
.settings{
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  height: 480px;
}
// .field {
//   width: 100%;
// }
input {
  width:80%;
}
.wysiwyg h3{
  margin-top: 1px;
}
</style>
