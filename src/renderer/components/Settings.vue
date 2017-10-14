<template>
  <section class="section settings">
    <div class="panel-top">
      <a> <router-link :to="{ path: '/' }">Go Back</router-link></a>
    </div>
    <b-field grouped>
      <p class="control">
        <b-field label="Username">
          <b-input v-model="userNameModel" placeholder="Your Facebook Username"></b-input>
        </b-field>
        <b-field label="Password">
          <b-input v-model="passwordModel" placeholder="Your Facebook Password"></b-input>
        </b-field>
        <b-field label="Frequency">
            <b-select  v-model="frequencyModel" placeholder="How often do you want to run the insepctor?">
                <option value="1"> Every 1 hours </option>
                <option value="3"> Every 3 hours </option>
                <option value="6"> Every 6 hours (default) </option>
                <option value="12"> Every 12 hours </option>
            </b-select>
        </b-field>
      </p>
    </b-field>
    <b-field grouped>
      <p class="control">
            <button @click="save()" class="panel"> <span class="name"> <a> Save Settings </a></span></button>
            <button @click="del()" class="panel"> <span class="name"> <a> Delete Settings </a></span></button>
            <button @click="scrape()" class="panel"> <span class="name"> <a> Run it now </a> </span></button>
      </p>
    </b-field>
      <b-field grouped>
          <p v-if="hasData" class="control">
            <button @click="exportData()" class="panel"> <span class="name"> <a> Export Data </a> </span></button>
            <button @click="delData()" class="panel"> <span class="name"> <a> Delete Data </a> </span></button>
          </p>
      </b-field>
  </section>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import keytar from 'keytar'
  import {getCsvData, deleteAllData} from '@/db'
  import { mapGetters, mapActions } from 'vuex'
  var {ipcRenderer} = require('electron')

  export default {
    name: 'Settings',
    components: { SystemInformation },
    created () {
      this.userNameModel = this.username
      this.frequencyModel = this.scrapeFrequency
    },
    data () {
      return {
        userNameModel: '',
        passwordModel: '',
        frequencyModel: '',
        err: false,
        keytar: keytar
      }
    },
    computed: {
      ...mapGetters([
        'username',
        'serviceName',
        'hasData',
        'dbPath',
        'hasCredentials',
        'scrapeFrequency'
      ])
    },
    methods: {
      save () {
        if (this.userNameModel.length > 0 && this.passwordModel.length > 0) {
          this.keytar.setPassword(this.serviceName, this.userNameModel, this.passwordModel)
          this.err = false
          this.$storage
            .set(`${this.serviceName}.json`, {username: this.userNameModel, frequency: this.frequencyModel})
            .then((d) => {
              this.setCredentials(this.userNameModel)
              this.info(`Saved details for ${this.userNameModel}`)
            })
            .catch((err) => {
              this.warning(`Err: username not stored ${err}`)
            })
          this.passwordModel = ''
        } else {
          this.warning('Please set a username and password before you save')
        }
      },
      exportData () {
        getCsvData(this.dbPath).then((results) => {
          ipcRenderer.send('export-data', {exportData: results})
        })
      },
      delData () {
        deleteAllData(this.dbPath)
          .then((results) => {
            this.info(`Deleted all ${results.session} sessions and ${results.pymk} people from the app.`)
          })
          .catch((err) => {
            this.warning(`Err: database not deleted ${err}`)
          })
      },
      del () {
        if (this.userNameModel.length > 0) {
          this.keytar.deletePassword(this.serviceName, this.username).then((x) => {
            console.log(this.serviceName, this.username)
            this.deleteCredentials()
            this.$storage
              .set(`${this.serviceName}.json`, {username: '', frequency: ''})
              .then((d) => {
                this.deleteCredentials()
                this.userNameModel = ''
                this.passwordModel = ''
                this.frequencyModel = '6'
                this.info('Settings deleted')
              })
              .catch((err) => {
                this.warning(`Err: credentials not deleted ${err}`)
              })
          })
        } else {
          this.warning('Didnt find any credentials')
        }
      },
      scrape: function () {
        if (this.hasCredentials) {
          keytar.getPassword(this.serviceName, this.username)
            .then((t) => {
              this.info('Running scrapper. You should see a browser pop up')
              ipcRenderer.send('fg-scrape', {username: this.username, password: t})
            })
            .catch((err) => {
              console.log('err')
              this.warning(`Error retrieving credentials: ${err}`)
            })
        } else {
          this.warning(`Couldnt find Facebook credentials. Please try and save them again`)
        }
      },
      goBack () {
        this.$route.push('landing-page')
      },
      info (msg) {
        this.$snackbar.open({
          duration: 5000,
          message: msg,
          type: 'is-info',
          position: 'is-top'
        })
      },
      warning (msg) {
        this.$snackbar.open({
          duration: 5000,
          message: msg,
          type: 'is-danger',
          position: 'is-top'
        })
      },
      ...mapActions([
        'setCredentials',
        'deleteCredentials'
      ])
    }
  }
</script>

<style lang="scss" scoped>
button:hover {
  background-color: #F25F5C;
}
</style>
