<template>
  <section>
  <article class="media" v-for="row in allSessions">
      <div class="media-content">
        <div class="content">
            <h5> {{row.timestamp | moment("MMM Do YYYY, h:mA") }} </h5>
             <mark> {{row.totalPymk}} people</mark>  were suggested,
             <mark> {{row.numNew}} </mark> of them were new and
             <mark> {{row.numNoMutual}} {{row.numNoMutual === 1 ? 'person' : 'people'}}</mark>
              had no mutual friends.
             <br>
            <span class="name"> See the list </span>
        </div>
      </div>
    </article>
  </section>
</template>

<script>
import {getAll, getMostRecentSession} from '@/db'
import {mapGetters} from 'vuex'
export default {

  name: 'SessionsTable',
  data () {
    return {
      allSessions: [
      ],
      selected: []
    }
  },
  mounted () {
    getAll('session', this.dbPath)
      .then((d) => { this.allSessions = d; this.selected = d[0] })
      .catch(err => { console.log(err) })
  },
  computed: {
    ...mapGetters([
      'dbPath'
    ])
  }
}
</script>

<style lang="scss">

.row {
  overflow-y: scroll;
  font-size: 16px
}
/* https://jsfiddle.net/r7ztu8oL/3/ */
.popup {
  background-color: #fff;
  border: 1px solid #ccc;
  position: fixed;
  top: 50%;
  left: 0;
  margin-left: 5%;
  width: 90%;
  max-height: 60%;
}

.popup-body {
  // margin-top: 40px;
  overflow-y: auto;
  height: 200px;
  display: block;
}

</style>
