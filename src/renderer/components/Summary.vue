<template>
 <section class="wysiwyg summary">
    <h2> Summary </h2>
    <div>
      The inspector has run <mark>{{sessionCount}} times</mark> in the past <mark>{{startDate | moment("from", true) }}.</mark>  <a> <router-link :to="{ path: '/sessions' }">More info</router-link> </a>
    </div>
    <div>
      In that time Facebook has suggested <mark>{{PymkCount}} people</mark> to you.
      The most common were <mark> {{commonPymk[0]}} </mark> <span v-for="name in commonPymk.slice(1, commonPymk.length)"> ,<mark> {{name}} </mark> </span>
      <router-link :to="{ path: '/people' }">  More Info </router-link>
    </div>
    <div> The most common places people work are <mark>{{commonWork[0]}}</mark> <span v-for="name in commonWork.slice(1,commonWork.length)"> ,<mark> {{name}} </mark> </span> </div>
    <a> <router-link :to="{ path: '/' }">Go Back</router-link></a>
 </section>
</template>
<!-- <mark>Big Daddy Kane</mark>, <mark>J Dilla</mark>, and <mark>Phife Dog</mark>. -->
<script>

import {SessionsCount, getStartDate, PymkCount, getCommonPymk, getPopularWork} from '@/db'
import {mapGetters} from 'vuex'
export default {

  name: 'Summary',
  data () {
    return {
      sessionCount: null,
      startDate: null,
      PymkCount: null,
      commonPymk: [],
      commonWork: []
    }
  },
  mounted () {
    this.getInfo()
  },
  computed: {
    ...mapGetters([
      'dbPath'
    ])
  },
  methods: {
    getInfo () {
      SessionsCount(this.dbPath)
        .then((count) => {
          this.sessionCount = count
          return this.dbPath
        })
        .then(getStartDate)
        .then((date) => {
          this.startDate = Date.parse(date)
          return this.dbPath
        })
        .then(PymkCount)
        .then((count) => {
          this.PymkCount = count
          return this.dbPath
        })
        .then(getCommonPymk)
        .then((common) => {
          this.commonPymk = common
          return this.dbPath
        })
        .then(getPopularWork)
        .then((work) => {
          this.commonWork = work
          return this.dbPath
        })
    }
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