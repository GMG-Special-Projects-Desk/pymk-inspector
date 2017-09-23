<template>
 <section v-if="summary" class="wysiwyg summary">
    <h2> Summary </h2>
    <div>
      The inspector has run <mark>{{summary.sessionCount}} times</mark> in the past <mark>{{summary.startDate | moment("from", true) }}.</mark>
       <a> <router-link :to="{ path: '/sessions' }">More info</router-link> </a>
    </div>
    <div v-if="summary.commonPymk">
      In that time Facebook has suggested <mark>{{summary.pymkCount}} people</mark> to you.
      The most common were <mark> {{summary.commonPymk[0]}} </mark>
      <span v-for="name in summary.commonPymk.slice(1, summary.commonPymk.length)">
        ,<mark> {{name}} </mark>
      </span>
      <router-link :to="{ path: '/people' }">  More Info </router-link>
    </div >
    <div v-if="summary.commonWork">
      The most common places people work are
      <mark>{{summary.commonWork[0]}}</mark>
       <span v-for="name in summary.commonWork.slice(1,summary.commonWork.length)">
        ,<mark> {{name}} </mark>
       </span>
    </div>
    <a> <router-link :to="{ path: '/' }">Go Back</router-link></a>
 </section>
</template>
<script>

import {getSummary} from '@/db'
import {mapGetters} from 'vuex'
export default {

  name: 'Summary',
  data () {
    return {
      summary: {}
    }
  },
  mounted () {
    getSummary(this.dbPath).then((summary) => {
      this.summary = summary.current
    })
  },
  computed: {
    ...mapGetters([
      'dbPath'
    ])
  }
}
</script>

<style lang="scss">
.summary{
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  height: 480px;
}
</style>