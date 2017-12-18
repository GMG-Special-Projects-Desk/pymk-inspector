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

  The Inspector is downloaded from <a @click="openAws()"> AWS</a>; its privacy policy can be found here. The Inspector is offered by the Gizmodo Media Group; its <a @click="openGizmodo()"> privacy policy</a> can be found here.
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
    }
  }
}
</script>

<style lang="scss">
</style>