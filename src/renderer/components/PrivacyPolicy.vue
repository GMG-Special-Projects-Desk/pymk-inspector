<template>
<section class="section privacy">
  <div class="panel-top">
    <a> <router-link :to="{ path: '/' }">Go Back</router-link></a>
  </div>
  <div class="panel">
  Gizmodo Media Group does not receive or collect information from use
  of the People You May Know Inspector. The PYMK Inspector collects
  information about a user's friend recommendations on Facebook, but all
  information collected is stored locally on a device designated by the
  user. If you have questions about this, please contact us at
  tips@gizmodomedia.com. 
  </div>
  <div class="panel">
  The Inspector is downloaded from AWS where me monitor anonymous download data using their server logs. Here is its <a @click="openAws()">privacy policy</a>. The Inspector is offered by the Gizmodo Media Group; here is its <a @click="openGizmodo()"> privacy policy</a>
  </div>
  <div class="panel">
  For the latest information please go to the <a @click="openGithub()">Github page</a> for this project.
  </div>
 </section>
</template>

<script>
const {shell} = require('electron')

export default {
  name: 'PrivacyPolicy',
  methods: {
    openAws () {
      shell.openExternal('https://aws.amazon.com/agreement/')
    },
    openGizmodo () {
      shell.openExternal('http://legal.kinja.com/privacy-policy-1793094625')
    },
    openGithub () {
      shell.openExternal('https://github.com/GMG-Special-Projects-Desk/pymk-inspector')
    }
  }
}
</script>

<style lang="scss">
</style>