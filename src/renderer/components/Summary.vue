<template>
 <section class="wysiwyg summary">
    <h2> Summary </h2>
    <div>The inspector has run <mark>56 times</mark> since the <mark>1st of Sept.</mark>  <a> <router-link :to="{ path: '/sessions' }">More info</router-link> </a></div>
    <div> In that time Facebook has suggested <mark>800 people</mark> to you. The most common were <mark>Big Daddy Kane</mark>, <mark>J Dilla</mark>, and <mark>Phife Dog</mark>.
    <router-link :to="{ path: '/people' }">  More Info </router-link></div>
    <div> The most common places people work are <mark>Apple</mark>, <mark>Google</mark> and <mark>Facebook</mark> </div>
    <a> <router-link :to="{ path: '/' }">Go Back</router-link></a>
 </section>
</template>

<script>
export default {

  name: 'Summary',
  data () {
    return {

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