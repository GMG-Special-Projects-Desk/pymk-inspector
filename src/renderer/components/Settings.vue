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
    <a> <router-link :to="{ path: '/' }">Go Back</router-link></a>
  </section>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import keytar from 'keytar'
  import { mapGetters } from 'vuex'
  export default {
    name: 'landing-page',
    components: { SystemInformation },
    created () {
      this.userNameModel = this.username()
    },
    data () {
      return {
        serviceName: 'pymkinspector',
        userNameModel: '',
        passwordModel: '',
        err: false,
        keytar: keytar
      }
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
      goBack () {
        this.$route.push('landing-page')
      },
      ...mapGetters([
        'username'
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
  margin-bottom: 2px;
}
</style>
