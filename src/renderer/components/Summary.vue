<template>
 <section v-if="summary" class="section summary">
    <div class="panel-top">
      <a> <router-link :to="{ path: '/' }">Go Back</router-link></a>
    </div>
    <div >
      <div class="panel">
        The inspector has run <em>{{summary.sessionCount}} times</em> since
        <em>{{ summary.startDate | moment("dddd, MMMM Do YYYY") }}.</em>
        On average per session you were shown <em>{{summary.avgPymk}} people per session</em>,
        <em>{{summary.avgNewPymk}} of whom had not been seen before</em> and
        <em>{{summary.avgNoMutualPymk}} with no mutual friends</em>
         <span class="name"> <router-link :to="{ path: '/sessions' }">Click  here for more details</router-link> </span>
      </div>
      <div class="panel" v-if="summary.commonPymk">
        In that time Facebook has suggested <em>{{summary.pymkCount}} people</em> to you.
        The most common were
        <b-tooltip :label="`${summary.commonPymk[0].sessions.length} sessions`"
            type="is-dark"
            position="is-bottom">
          <em class="data-hover"> {{summary.commonPymk[0].name}} </em>
        </b-tooltip>

        <span v-for="pymk in summary.commonPymk.slice(1, summary.commonPymk.length)">
          <b-tooltip :label="`${pymk.sessions.length} sessions`"
              type="is-dark"
              position="is-bottom">
            , <em class="data-hover"> {{pymk.name}} </em>
          </b-tooltip>
        </span>
        <span class="name"> <router-link :to="{ path: '/people' }">Click  here for more details</router-link> </span>
      </div>
      <div class="panel" v-if="summary.commonWork">
        The most common places people work are
        <b-tooltip :label="`${summary.commonWork[0].count} people you may know`"
            type="is-dark"
            position="is-bottom">
        <em class="data-hover">{{summary.commonWork[0].name}}</em>
      </b-tooltip>
         <span v-for="job in summary.commonWork.slice(1,summary.commonWork.length)">
        <b-tooltip :label="`${summary.commonWork[0].count} people you may know`"
            type="is-dark"
            position="is-bottom">
          ,<em class="data-hover"> {{job.name}} </em>
        </b-tooltip>
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