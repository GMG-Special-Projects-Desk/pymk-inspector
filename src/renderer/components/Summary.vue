<template>
 <section v-if="summary" class="section summary">
    
    <div class="panel-top">
      <a @click="setShouldRefresh(true)"><b-icon icon="refresh"> </b-icon> </a>
      <a> <router-link :to="{ path: '/' }">Go Back</router-link></a>
    </div>

    <div >
      <div class="panel">
        The inspector has run          <span class="name"> <router-link :to="{ path: '/sessions' }">{{summary.sessionCount}} times</router-link> </span> since
        <em>{{ summary.startDate | moment("dddd, MMMM Do YYYY") }}.</em>
        On average per session you were shown <em>{{summary.avgPymk}} people</em>,
        <em>{{summary.avgNewPymk}} of whom had not been seen before</em> and
        <em>{{summary.avgNoMutualPymk}} with no mutual friends</em>
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
        <br>
        <span class="name"> <router-link :to="{ path: '/people' }">Click  here to see everyone you've been recommended</router-link> </span>
      </div>
      <div class="panel" v-if="summary.hasOwnProperty('commonPymkNoMutual') && summary.commonPymkNoMutual.length > 0">
        The most common people with no mutual friends that you were suggested include
        <b-tooltip 
          :label="`${summary.commonPymkNoMutual[0].sessions.length} sessions`"
          type="is-dark"
          position="is-bottom">
          <em class="data-hover"> {{summary.commonPymkNoMutual[0].name}} </em>
        </b-tooltip>
         <span v-for="person in summary.commonPymkNoMutual.slice(1,summary.commonPymkNoMutual.length)">
        <b-tooltip :label="`${person.sessions.length} sessions`"
            type="is-dark"
            position="is-bottom">
          ,<em class="data-hover"> {{person.name}} </em>
        </b-tooltip>
         </span>
      </div>
  </div>
 </section>
</template>
<script>

import {mapGetters, mapActions} from 'vuex'
export default {

  name: 'Summary',
  computed: {
    ...mapGetters([
      'dbPath',
      'summary',
      'shouldRefresh'
    ])
  },
  methods: {
    ...mapActions([
      'setShouldRefresh'
    ])
  }
}
</script>

<style lang="scss">
</style>