<template>
  <div id="app">
    <QuizGenerator />
  </div>
</template>

<script>
import QuizGenerator from './components/QuizGenerator.vue'
export default {
  name: 'App',
  components: { QuizGenerator },
}
</script>

<style>
html, body, #app { height: 100%; margin: 0; }
</style>
