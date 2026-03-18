/**
 * Main Application Entry Point
 * ============================
 * This file initializes the Vue 3 application and mounts it to the DOM.
 *
 * Flow:
 * 1. Import Vue's createApp function
 * 2. Import the root App component
 * 3. Import global styles
 * 4. Create and mount the Vue app instance to #app element in index.html
 *
 * The app will render the Chatbot component wrapped in App.vue
 */

import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// Create Vue app instance and mount to #app element
createApp(App).mount('#app')