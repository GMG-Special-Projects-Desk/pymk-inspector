<template>
<footer class="footer">
  <div class="container">
    <div class="content">
      <p class="footer-text has-text-centered">
          Did you find somone noteworthy? <br>
          Share your story with  the <span @click="sendTip()" class="name"> Special Projects Desk </span>
      </p>
    </div>
  </div>
</footer>
</template>

<script>
const {shell} = require('electron')

export default {

  name: 'BottomBar',
  methods: {
    sendTip () {
      shell.openExternal('https://specialprojectsdesk.kinja.com/about-the-gizmodo-media-group-special-projects-desk-1792136692')
    }
  }
}
</script>

<style lang="scss" scoped>
.name {
  color: #247BA0;
  cursor: pointer;
}
</style>