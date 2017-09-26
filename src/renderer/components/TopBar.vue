<template>
  <section class="hero is-primary">
    <div class="hero-body">
      <div class="container">

        <h1 class="title is-4 has-text-centered">
          {{$route.name}}
        </h1>
        <h2 class="subtitle">
        </h2>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TopBar'
}
</script>

<style lang="scss" scoped>
.hero-body {
  padding: 1rem 0.5rem;
}
.hero {
  position: fixed;
  z-index: 999;
  width: 100%;
  top: 0px;
  left: 0px;
}
</style>