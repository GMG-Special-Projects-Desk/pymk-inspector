<template>
  <section>
    <h2 class="title is-5"> Facebook's People You May Know Inspector</h2>
  <div v-if="hasCredentials">
      <span class="subtitle is-6"> Currently collecting data for  {{username}}</span>
      <div>
        <button class="button is-outlined  test" @click="() => {this.$router.push({path: 'credentials'})}">Settings</button>
      </div>
  </div>
  <p v-else>
      Looks like this is your first time using the app or there are no credentials stored. <button ><router-link :to="{ path: '/credentials' }">Save Credentials</router-link></button><br><br>
      <button class="button is-outlined is-primary" @click="() => {this.$router.push({path: 'credentials'})}">Settings</button><br><br>
  </p>
</section>
</template>

<script>
  import {getAll} from '@/db'
  import {mapGetters} from 'vuex'
  export default {
    name: 'main',
    data () {
      return {
        serviceName: 'pymkinspector'
      }
    },
    computed: {
      ...mapGetters([
        'hasCredentials',
        'username'
      ])
    }
  }
</script>

<style lang='scss'>
@import '~bulma';
.test {
  border-color: #292929;

}
/*$fa-font-path: '~font-awesome/fonts/';*/
/*@import '~font-awesome/scss/font-awesome';*/

</style>