<template>
  <section>
    <div class="field">
      <p class="control has-icons-left has-icons-right">
        <input v-model="userNameModel" class="input" type="username" placeholder="Username">
        <span class="icon is-small is-left">
          <i class="fa fa-envelope"></i>
        </span>
        <span class="icon is-small is-right">
          <i class="fa fa-check"></i>
        </span>
      </p>
    </div>
    <div class="field">
      <p class="control has-icons-left">
        <input v-model="passwordModel" class="input" type="password" placeholder="Password">
        <span class="icon is-small is-left">
          <i class="fa fa-lock"></i>
        </span>
      </p>
    </div>
    <div class="field">
      <p class="control">
        <button @click="save()" class="button is-success">
          Save Credentials
        </button>
      </p>
    </div>
    <div class="field">
      <p class="control">
        <button @click="del()" class="button is-danger">
          Delete Credentials
        </button>
      </p>
    </div>
    <div class="field">
      <p class="control">
        <button @click="() => {this.$router.push({path: 'main'})}" class="button is-success">
          Go Back
        </button>
      </p>
    </div>
  </section>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import keytar from 'keytar'
  import { mapGetters } from 'vuex'
  var {remote} = require('electron')
  const app = remote.app

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
              app.log.info('[Credentials][save] username stored')
            })
            .catch((err) => { app.log.error(`[Credentials][save] username not stored ${err}`) })
          this.userNameModel = ''
          this.passwordModel = ''
        } else {
          this.err = true
        }
      },
      del () {
        this.keytar.deletePassword(this.serviceName, this.username).then((x) => {
          app.log.info(`[Credentials][del password] ${x}`)
        })
        this.$storage
          .set(`${this.serviceName}.json`, {username: ''})
          .then((d) => { app.log.info('[Credentials][save] credentials cleared') })
          .catch((err) => { app.log.error(`[Credentials][save] credentials not deleted ${err}`) })
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

<style>
</style>
