<template>
<section class="wysiwyg">
    <h2 style="text-align: center;"> People </h2>
    <div>
      The inspector has collected <mark> 800 people</mark> since it started running.

    </div>
    <people-table> </people-table>
    <a> <router-link :to="{ path: '/summary' }">Go Back</router-link></a>
 </section>
</template>

<script>
import PeopleTable from './People/PeopleTable'
export default {

  name: 'People',
  components: {
    PeopleTable
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss">

</style>