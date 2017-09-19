<template>
<section class="wysiwyg">
    <h2 style="text-align: center;"> Sessions </h2>
    <div>
      The inspector has run <mark>56 times</mark> since the <mark>1st of Sept.</mark> On average per session you were shown <mark>176 people</mark>, <mark>35 of whom had not been seen before</mark> and
      <mark>8 with no mutual friends</mark>
    </div>
    <sessions-table> </sessions-table>
    <a> <router-link :to="{ path: '/summary' }">Go Back</router-link></a>
 </section>
</template>

<script>
import SessionsTable from './Sessions/SessionsTable'
export default {

  name: 'Sessions',
  components: {
    SessionsTable
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
.sessions{
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  height: 480px;
}
</style>