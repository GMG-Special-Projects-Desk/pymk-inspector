<template>
  <section>
  <div class="panel-top">
    <span class="button">
      <router-link :to="{ path: '/sessions' }"> Go Back</router-link>
    </span>
  </div>
  <article class="media" v-for="row in sessionFbids">
    <figure class="media-left">
      <p class="image">
        <img style="max-width: 100px;" v-if="row.imgSrc" :src="row.imgSrc">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <strong class="name" @click="open(row.url)">{{row.name}} </strong>
          <br>
          <small v-if="row.job">{{row.job}} </small>
          <br>
          <span class="details">
          They have been suggested to you
          <b-tooltip
              multilined="true"
              :label="`${row.sessions.map((t) => {
                  return new Date(t).toLocaleDateString()
                })}`"
            type="is-dark"
            position="is-top">
          <em class="data-hover">
            {{row.sessions.length}} {{row.sessions.length === 1 ? 'time' : 'times'}}
          </em>
          </b-tooltip>
          and were first seen on <em> {{row.created | moment("MMM Do YYYY") }}
          </em> and you have <em> {{row.mutualFriends}} mutual friends </em>.
        </span>
        </p>
      </div>
    </div>
  </article>
</section>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  name: 'SessionPeopleTable',
  data () {
    return {
      displayPeople: []
    }
  },
  watch: {
    sessionFbids (val) {

    }
  },
  computed: {
    ...mapGetters([
      'sessionFbids',
      'filteredPeople',
      'allPeople'
    ])
  }
}
</script>

<style lang="scss">
$striped-rows: true;

.details {
  font-size: 0.8rem;
}

.tips {
  font-size: 0.7em;
  float: right;
}

</style>
