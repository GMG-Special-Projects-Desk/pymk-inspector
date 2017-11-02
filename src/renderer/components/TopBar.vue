<template>
  <section class="hero is-primary">
    <div class="hero-body">
      <div class="container">
        <h1 class="title is-4 has-text-centered">
          {{$route.name | capitalize}}
        </h1>

      </div>
    </div>
  </section>
</template>

<script>

export default {
  name: 'TopBar',
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
}
</script>

<style lang="scss" scoped>
.hero-body {
  padding: 1rem 0.9rem;
  .title {
    background-color: #FF006E;
  }
}

// .title::before{
//   content:url('../assets/64.png');
//   max-width: 200px;
// }
.hero {
  position: fixed;
  z-index: 999;
  width: 100%;
  top: 0px;
  left: 0px;
}
</style>