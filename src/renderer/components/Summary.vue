<template>
 <section v-if="summary" class="section">
    <div class="panel-top">
      <a> <router-link :to="{ path: '/' }">Go Back</router-link></a>
    </div>
    <div >
      <div class="panel">
        The inspector has run <mark>{{summary.sessionCount}} times</mark> since
        <mark>{{ summary.startDate | moment("dddd, MMMM Do YYYY") }}.</mark>
        On average per session you were shown <mark>{{summary.avgPymk}} people per session</mark>,
        <mark>{{summary.avgNewPymk}} of whom had not been seen before</mark> and
        <mark>{{summary.avgNoMutualPymk}} with no mutual friends</mark>
         <span class="name"> <router-link :to="{ path: '/sessions' }">Details</router-link> </span>
      </div>
      <div class="panel" v-if="summary.commonPymk">
        In that time Facebook has suggested <mark>{{summary.pymkCount}} people</mark> to you.
        The most common were <mark> {{summary.commonPymk[0]}} </mark>
        <span v-for="name in summary.commonPymk.slice(1, summary.commonPymk.length)">
          ,<mark> {{name}} </mark>
        </span>
        <span class="name"> <router-link :to="{ path: '/people' }">Details</router-link> </span>
      </div>
      <div class="panel" v-if="summary.commonWork">
        The most common places people work are
        <mark>{{summary.commonWork[0]}}</mark>
         <span v-for="name in summary.commonWork.slice(1,summary.commonWork.length)">
          ,<mark> {{name}} </mark>
         </span>
      </div>
  </div>
 </section>
</template>
<script>

import {mapGetters} from 'vuex'
export default {

  name: 'Summary',
  computed: {
    ...mapGetters([
      'dbPath',
      'summary'
    ])
  }
}
</script>

<style lang="scss">
</style>