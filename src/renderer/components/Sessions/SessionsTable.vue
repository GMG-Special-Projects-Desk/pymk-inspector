<template>
  <section>
  <article class="media" v-for="row in allSessions">
      <div class="media-content">
        <div class="content">
            Session ran at <mark> {{row.timestamp | moment("MMM Do YYYY, hh:mm:ss") }} </mark>. <br>
             <mark> {{row.totalPymk}} </mark> people were suggested, <mark> {{row.numNew}} </mark> of them were new and <mark> {{row.numNoMutual}} </mark>
              <a> Click here </a> to see a list of the people you were suggested
        </div>
      </div>
    </article>
  </section>
<!--   <section>
      <b-table
          :data="allSessions"
          @click="(row, index) =>{ $toast.open(`Expanded ${row.timestamp}`)}"
          >
          <template scope="props">
              <b-table-column label="Session Time" width="40">
                  {{props.row.timestamp | moment("MMM Do YYYY, hh:mm:ss") }}
              </b-table-column>

              <b-table-column label="People Suggested">
                  {{props.row.totalPymk}}
              </b-table-column>

              <b-table-column label="New Suggestions">
                  {{props.row.numNew}}
              </b-table-column>
              <b-table-column label="No Mutual Friends">
                  {{props.row.numNoMutual}}
              </b-table-column>
          </template>
      </b-table>
  </section> -->
<!--   <section class='popup'>
    <div class="popup-body">
      <div class="row" v-for="t in allSessions">
        <span> {{t.timestamp | moment("MMM Do YYYY") }}</span>
        <span>{{t.totalPymk}} total</span>
        <span> {{t.numNew}} new people. </span>
      </div>
    </div>
  </section> -->
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
