<template>
    <div class="panel-top">
      <b-field grouped>
          <p class="control">
            <span class="button is-small">
              <router-link :to="{ path: '/summary' }"> Go Back</router-link>
            </span>
          </p>
          Sort by:
          <b-select size="is-small">
              <option v-for="p in filter" value="p">
                {{p}}
              </option>
          </b-select>
      </b-field>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'FilterBar',
  computed: {
    filter () {
      if (this.$route.name === 'pymk') {
        return this.pymkFilters
      } else {
        return this.sessionFilters
      }
    },
    ...mapGetters([
      'pymkFilters',
      'sessionFilters'
    ])
  }
}
</script>

<style lang="scss" scoped>
</style>