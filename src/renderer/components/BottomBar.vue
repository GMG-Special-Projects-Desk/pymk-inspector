<template>
<footer class="footer">
  <div class="container">
    <div class="content">
      <p class="footer-text has-text-centered">
          Did you find someone noteworthy? <br>
          Share your story with <span @click="sendTip()" class="name"> <a> tips@gizmodomedia.com </a> </span>
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
      shell.openExternal('mailto:tips@gizmodomedia.com')
    }
  }
}
</script>

<style lang="scss" scoped>
.footer-text {
  font-size: 0.9em;
}
.name {
  cursor: pointer;
  a {
    color: white
  }
}
</style>