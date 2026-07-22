<template>
  <!-- Root application container -->
  <div id="app">
    <AdminDashboard v-if="isAdmin" />
    <template v-else>
      <!--
        CU homepage — a branded backdrop so the chatbot isn't
        floating on a blank white screen during the demo.
      -->
      <HomePage />

      <!--
        Main chatbot component
        Renders as a floating button in the bottom-right corner.
        When clicked, opens a chat window for RAG-based Q&A.
      -->
      <Chatbot />
    </template>
  </div>
</template>

<script>
/**
 * App.vue - Root Component
 * =========================
 * Renders the CU Admin Dashboard at /admin, or the CU homepage
 * with the floating chatbot widget on all other routes.
 */

import { ref } from 'vue'
import Chatbot from './components/Chatbot.vue'
import HomePage from './components/HomePage.vue'
import AdminDashboard from './components/AdminDashboard.vue'

export default {
  name: 'App',
  components: { Chatbot, HomePage, AdminDashboard },
  setup() {
    const isAdmin = ref(window.location.pathname.startsWith('/admin'))
    return { isAdmin }
  }
}
</script>

<style>
/*
 * Global Styles
 * =============
 * Ensure full height for the app container and remove default margins.
 * This allows the floating chatbot button to position correctly.
 */
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>
