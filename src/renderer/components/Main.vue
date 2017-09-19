<template>
  <section class="wysiwyg main">
    <h2> Facebook's People You May Know Inspector </h2>
    <div> The most recent session was <mark>4 hours ago</mark>. In that session <mark>54 people were suggested</mark>,  there were <mark>3 people with no mutual friends</mark> and <mark>11 people that the inspector hadn't seen before</mark>. <router-link :to="{ path: '/summary' }">Click here</router-link> to see the more details.</div>
    <div>
    <p> Current user: samatt@gmail.com</p>
    <p @click="dbGet()"> Total sessions : 32</p>
    </div>
    <a> <router-link :to="{ path: '/settings' }">Inspector settings</router-link></a>
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
    methods: {
      dbGet () {
        getAll('session', this.dbPath)
          .then((d) => { console.log(d) })
          .catch(err => { console.log(err) })
        getAll('pymk', this.dbPath)
          .then((d) => { console.log(d) })
          .catch(err => { console.log(err) })
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
// @import '~bulma';
.main{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 480px;
}

</style>