<template>
  <!-- Root application container -->
  <div id="app">
    <!--
      Demo college homepage — purely a backdrop so the chatbot isn't
      floating on a blank white screen during the demo. Not part of the
      RAG system; the chatbot answers only from backend/app/documents/txts.
    -->
    <HomePage />

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
 * It renders a demo college homepage (background) plus the Chatbot
 * component, which handles all the chat functionality as a floating
 * widget on top of it.
 *
 * The Chatbot component is self-contained and includes:
 * - Floating button (collapsed state)
 * - Chat window (expanded state)
 * - API integration for RAG queries
 * - Document source display
 * - Message history
 */

import Chatbot from './components/Chatbot.vue'
import HomePage from './components/HomePage.vue'

export default {
  name: 'App',
  components: { Chatbot, HomePage }
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
