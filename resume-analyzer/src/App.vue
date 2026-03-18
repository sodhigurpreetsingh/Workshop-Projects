<template>
  <!-- Root application container -->
  <div id="app">
    <!--
      Main resume analyzer component
      Provides AI-powered resume analysis
    -->
    <ResumeAnalyzer />
  </div>
</template>

<script>
/**
 * App.vue - Root Component
 * =========================
 * This is the root component that wraps the entire application.
 * It renders the ResumeAnalyzer component which handles resume upload and AI analysis.
 *
 * The ResumeAnalyzer component includes:
 * - Resume upload (drag & drop or click)
 * - File validation (PDF, DOC, DOCX)
 * - AI-powered analysis
 * - Results display with ATS score, strengths, weaknesses, suggestions
 */

import ResumeAnalyzer from './components/ResumeAnalyzer.vue'

export default {
  name: 'App',
  components: { ResumeAnalyzer }
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
