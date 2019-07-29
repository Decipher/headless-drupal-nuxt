<template>
  <div id="app">
    <div class="reveal">
      <nuxt />
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    const Reveal = require('reveal.js/js/reveal')
    Reveal.initialize({
      dependencies: [{ src: 'plugin/highlight/highlight.js', async: true }]
    })
  }
}
</script>

<style>
@import url('../node_modules/reveal.js/css/reveal.css');
@import url('../node_modules/reveal.js/css/theme/white.css');

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  height: 100vh;
}
</style>
