/**
 * Custom Element (Web Component) Definition
 * ==========================================
 * This file creates a web component version of the chatbot that can be
 * embedded in any HTML page without requiring a Vue.js app setup.
 *
 * Usage:
 * ------
 * After building with `npm run build:ce`, include the generated JS file:
 *
 * ```html
 * <script src="chatbot.js"></script>
 * <row-chatbot></row-chatbot>
 * ```
 *
 * The chatbot will render as a self-contained web component that works
 * in any HTML page, regardless of the framework (React, Angular, vanilla JS, etc.)
 *
 * Build command: npm run build:ce
 * Config file: vite.ce.config.js
 */

import { defineCustomElement } from 'vue'
import Chatbot from './components/Chatbot.vue'

// Convert the Vue component into a custom element (web component)
const ChatbotElement = defineCustomElement(Chatbot)

// Register the custom element if it hasn't been registered yet
// This prevents errors if the script is included multiple times
if (!customElements.get('row-chatbot')) {
  customElements.define('row-chatbot', ChatbotElement)
}

export default ChatbotElement
