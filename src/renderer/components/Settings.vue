<template>
  <section class="section settings">
    <div class="panel-top">
      <a> <router-link :to="{ path: '/' }">Go Back</router-link></a>
    </div>
      <p class="control">
        <b-field label="If this is your first time click 'Run it now' to run this app. A browser window will appear that will allow you to log into Facebook. If you log out, you will have to sign in again the next time you run the app." > </b-field>
        <b-field label="The inspector tries to run every 6 hours. If you do not want it to run simply close the browser window." > </b-field>
      </p>
    <b-field grouped>
        <p class="control">
          <button @click="scrape()" class="panel"> <span class="name"> <a> Run it now </a> </span></button>
          <button v-if="hasData"  @click="exportData()" class="panel"> <span class="name"> <a> Export Data </a> </span></button>
          <button v-if="hasData"  @click="delData()" class="panel"> <span class="name"> <a> Delete Data </a> </span></button>
        </p>
    </b-field>
    <p class="control">
      <b-field label="To uninstall this app please first DELETE THE DATA using the button above and then move to your Trash folder." > </b-field>
      <b-field label="If you use a password manager and want to paste your password in please right click on the password field to do so." > </b-field>
    </p>
  </section>
</template>

<script>
  import keytar from 'keytar'
  import {getCsvData, deleteAllData} from '@/db'
  import { mapGetters, mapActions } from 'vuex'
  var {ipcRenderer, remote} = require('electron')
  const app = remote.app

  export default {
    name: 'Settings',
    created () {
      this.frequencyModel = this.scrapeFrequency
    },
    data () {
      return {
        frequencyModel: '',
        err: false,
        keytar: keytar
      }
    },
    computed: {
      ...mapGetters([
        'username',
        'serviceName',
        'mostRecent',
        'hasData',
        'dbPath',
        'scrapeFrequency'
      ])
    },
    methods: {
      exportData () {
        getCsvData(this.dbPath).then((results) => {
          ipcRenderer.send('export-data', {exportData: results})
        })
      },
      delData () {
        deleteAllData(this.dbPath)
          .then((results) => {
            this.info(`Deleted all ${results.session} sessions and ${results.pymk} people from the app.`)
            app.log.warn(`Deleted all ${results.session} sessions and ${results.pymk} people from the app.`)
          })
          .catch((err) => {
            this.warning(`Err: database not deleted ${err}`)
          })
        this.$storage
          .set(`${this.serviceName}.json`, {frequency: this.frequencyModel})
          .then((d) => {
            ipcRenderer.send('settings-updated', {})
          })
          .catch((err) => {
            app.log.warn(`Deleted mostRecent from config`)
            this.warning(`Couldnt del mostRecent scrape ${err}`)
          })
      },
      scrape: function () {
        this.info('Opening Facebook... You should see a browser pop up')
        ipcRenderer.send('fg-scrape', {})
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
      ...mapActions([])
    }
  }
</script>

<style lang="scss" scoped>
.button-group {
  margin-top: 20px;
}
</style>
