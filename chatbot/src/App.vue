<template>
  <!-- Root application container -->
  <div id="app">
    <!--
      Main chatbot component
      Renders as a floating button in the bottom-right corner
      When clicked, opens a chat window for RAG-based Q&A
    -->
    <Chatbot />
  </div>
</template>

<script>
/**
 * App.vue - Root Component
 * =========================
 * This is the root component that wraps the entire application.
 * It simply renders the Chatbot component which handles all the chat functionality.
 *
 * The Chatbot component is self-contained and includes:
 * - Floating button (collapsed state)
 * - Chat window (expanded state)
 * - API integration for RAG queries
 * - PDF source display
 * - Message history
 */

import Chatbot from './components/Chatbot.vue'

export default {
  name: 'App',
  components: { Chatbot }
}
</script>

<style>
/*
 * Global Styles
 * =============
 * Ensure full height for the app container and remove default margins
 * This allows the floating chatbot button to position correctly
 */
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>
