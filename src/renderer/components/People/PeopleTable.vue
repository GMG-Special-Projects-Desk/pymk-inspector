<template>
  <section>
  <article class="media" v-for="row in allPeople">
    <figure class="media-left">
      <p class="image is-40x40">
        <img v-if="row.imgSrc" :src="row.imgSrc">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <strong @click="open(row.url)">{{row.name}}</strong>  <small v-if="row.job"> Works at {{row.job}} </small>
          <br>
          <span class="details">
          They have been suggested to you <mark> {{row.sessions.length}} times </mark> and were first seen on <mark> {{row.created | moment("MMM Do YYYY") }}
          </mark> and you have <mark> {{row.mutualFriends}} mutual friends </mark>.
        </span>
        </p>
        <a @click="sendTip()" class="details">
         <b-icon icon="mail"></b-icon> Seems odd? Tell us why.
       </a>
      </div>
    </div>
  </article>
</section>
</template>
<script>
import {getAll} from '@/db'
import {mapGetters} from 'vuex'
const {shell} = require('electron')

export default {
  name: 'PeopleTable',
  data () {
    return {
      allPeople: []
    }
  },
  mounted () {
    getAll('pymk', this.dbPath)
      .then((d) => { this.allPeople = d })
      .catch(err => { console.log(err) })
  },
  methods: {
    open (url) {
      shell.openExternal(url)
    },
    sendTip () {
      shell.openExternal('https://specialprojectsdesk.kinja.com/about-the-gizmodo-media-group-special-projects-desk-1792136692')
    }
  },
  computed: {
    ...mapGetters([
      'dbPath'
    ])
  }
}
</script>

<style lang="scss">
$striped-rows: true;
.row {
  overflow: scroll;
  font-size: 16px
}

.details {
  font-size: 0.7em;
}
/* https://jsfiddle.net/r7ztu8oL/3/ */
.popup {
  background-color: #fff;
  border: 1px solid #ccc;
  position: fixed;
  top: 25%;
  left: 18px;
  // margin:auto 0;
  width: 90%;
  max-height: 60%;
}

.profile {
  max-width: 80px;
}
.popup-body {
  // margin-top: 40px;
  overflow-y: auto;
  height: 340px;
  display: block;
}

</style>
