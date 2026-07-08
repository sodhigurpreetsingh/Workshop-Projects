<template>
  <div>
    <!-- Floating chat button (closed state) -->
    <button v-if="!isOpen" class="floating-button" @click="toggleChat" aria-label="Open chat">
      <svg class="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8 10h.01M12 10h.01M16 10h.01M21 10c0 3.866-3.582 7-8 7a8.76 8.76 0 01-3.786-.839L3 19l1.324-3.531A6.993 6.993 0 015 10c0-3.866 3.582-7 8-7s8 3.134 8 7z"
        />
      </svg>
    </button>

    <!-- Chat window (open state) -->
    <transition name="slide-up">
      <div v-if="isOpen" class="chat-window">
        <!-- Header -->
        <div class="chat-header">
          <div class="header-content">
            <div class="header-icon">
              <!-- Inline SVG mark — no external logo asset required -->
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 3L2 8l10 5 8-4.09V17h2V8L12 3z"
                  fill="currentColor"
                />
                <path
                  d="M6 10.5V15c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5l-6 3-6-3z"
                  fill="currentColor"
                  opacity="0.55"
                />
              </svg>
            </div>
            <div class="header-text">
              <div class="header-title">Campus Assistant</div>
              <div class="header-subtitle">Ask me about DIT</div>
            </div>
          </div>
          <button class="close-btn" @click="toggleChat" aria-label="Close chat">✕</button>
        </div>

        <!-- Messages area -->
        <div ref="messagesContainer" class="chat-messages">
          <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
            <div class="message-bubble">
              <!-- Message content -->
              <div v-html="formatContent(msg.content)"></div>

              <!-- Display document sources (for assistant messages) -->
              <div v-if="msg.role === 'assistant' && msg.sources && msg.sources.length > 0" class="message-sources">
                <details class="sources-details">
                  <summary class="sources-summary">📚 Sources ({{ msg.sources.length }})</summary>
                  <div class="sources-list">
                    <div v-for="(source, idx) in msg.sources" :key="idx" class="source-item">
                      <div class="source-header">
                        <strong class="source-file">{{ getFileName(source.file) }}</strong>
                      </div>
                      <p class="source-preview">{{ source.content_preview }}</p>
                    </div>
                  </div>
                </details>
              </div>

              <!-- Display execution time (for assistant messages) -->
              <div v-if="msg.role === 'assistant' && msg.metadata?.execution_time_ms" class="message-metadata">
                <span class="metadata-badge">⚡ {{ Math.round(msg.metadata.execution_time_ms) }}ms</span>
              </div>
            </div>

            <!-- Timestamp -->
            <div class="message-time">{{ formatTime(msg.timestamp) }}</div>
          </div>

          <!-- Typing indicator -->
          <div v-if="sending" class="message assistant typing-message">
            <div class="message-bubble">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Input area -->
        <div class="chat-input-area">
          <form @submit.prevent="sendMessage" class="input-form">
            <input
              ref="inputRef"
              v-model="input"
              type="text"
              class="chat-input"
              placeholder="Ask about programs, placements, facilities..."
              :disabled="sending"
            />
            <button type="submit" class="send-btn" :disabled="sending || !input.trim()">
              <svg class="send-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.40613026,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16865566 C3.50612381,0.9115583 2.40613026,1.0216722 1.77946707,1.4930712 C0.994623095,2.0797379 0.837654326,3.1711255 1.15159189,3.95662241 L3.03521743,10.3976154 C3.03521743,10.5547128 3.19218622,10.7118102 3.50612381,10.7118102 L16.6915026,11.4972971 C16.6915026,11.4972971 17.1624089,11.4972971 17.1624089,11.0259051 L17.1624089,12.6315722 C17.1624089,12.8886695 17.1624089,12.4744748 16.6915026,12.4744748 Z"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
/**
 * Chatbot.vue - RAG Chatbot Component
 * ====================================
 *
 * A Vue 3 component that provides a floating chat interface for RAG (Retrieval
 * Augmented Generation) queries. The chatbot displays as a button that opens
 * into a full chat window.
 *
 * Key Features:
 * - Floating button UI (collapsed state)
 * - Full chat window (expanded state)
 * - RAG API integration via Axios
 * - Document source citations display
 * - Execution time metadata
 * - Auto-scroll to latest message
 * - Error handling
 * - Responsive design
 *
 * API Integration:
 * - POST /api/v1/chat/ask - Send question and get RAG response
 * - Expects: { question: string }
 * - Returns: { success, answer, sources[], metadata{} }
 *
 * Component Architecture:
 * - Uses Vue 3 Composition API
 * - Self-contained state management
 * - No external state libraries needed
 */

import { ref, nextTick, onMounted } from 'vue';
import myAxios from '../utils/my-axios.js';

export default {
  name: 'ChatbotSimple',
  setup() {
    // ==========================================================================
    // Reactive State
    // ==========================================================================

    /**
     * isOpen: Controls whether chat window is visible
     * - true: Chat window is displayed
     * - false: Only floating button is displayed
     */
    const isOpen = ref(false);

    /**
     * messages: Array of chat messages
     * Each message has:
     * - role: 'user' | 'assistant'
     * - content: The message text
     * - timestamp: Date object
     * - sources: Array of document sources (assistant only)
     * - metadata: Execution time and other stats (assistant only)
     */
    const messages = ref([
      {
        role: 'assistant',
        content: 'Welcome to Demo Institute of Technology! 🎓 I can help answer questions about our programs, placements, facilities, and campus life. What would you like to know?',
        timestamp: new Date(),
      },
    ]);

    /**
     * input: Current text in the input field (v-model binding)
     */
    const input = ref('');

    /**
     * sending: Whether a message is currently being sent
     * - true: Show typing indicator, disable input
     * - false: Normal state
     */
    const sending = ref(false);

    /**
     * messagesContainer: Template ref to messages scroll container
     * Used for programmatic scrolling
     */
    const messagesContainer = ref(null);

    /**
     * inputRef: Template ref to input field
     * Used for programmatic focus
     */
    const inputRef = ref(null);

    // ==========================================================================
    // Methods
    // ==========================================================================

    /**
     * toggleChat
     * ----------
     * Toggles the chat window open/closed. When opening, scrolls to bottom
     * and focuses the input field.
     */
    const toggleChat = () => {
      isOpen.value = !isOpen.value;
      if (isOpen.value) {
        // Wait for DOM update before scrolling/focusing
        nextTick(() => {
          scrollToBottom();
          focusInput();
        });
      }
    };

    /**
     * sendMessage
     * -----------
     * Sends a user message to the RAG API and handles the response.
     *
     * Flow:
     * 1. Validate input is not empty
     * 2. Add user message to chat
     * 3. Clear input field
     * 4. Call RAG API with question
     * 5. Add API response to chat (with sources and metadata)
     * 6. Handle errors gracefully
     * 7. Auto-scroll and focus input
     */
    const sendMessage = async () => {
      const question = input.value.trim();
      if (!question) return;

      // Add user message to chat
      messages.value.push({
        role: 'user',
        content: question,
        timestamp: new Date(),
      });

      // Clear input
      input.value = '';

      // Scroll to show user message
      nextTick(() => scrollToBottom());

      // Set loading state
      sending.value = true;

      try {
        // Call RAG API
        const response = await myAxios.post('/chat/ask', {
          question: question,
        });

        const data = response.data;

        // Handle response based on success flag
        if (!data) {
          // No response data from server
          messages.value.push({
            role: 'assistant',
            content: 'No response from server. Please try again.',
            timestamp: new Date(),
          });
        } else if (!data.success) {
          // API returned error
          messages.value.push({
            role: 'assistant',
            content: data.answer || 'An error occurred. Please try again.',
            timestamp: new Date(),
          });
        } else {
          // Success - add response with sources and metadata
          messages.value.push({
            role: 'assistant',
            content: data.answer,
            timestamp: new Date(),
            sources: data.sources || [],
            metadata: data.metadata || {},
            context_used: data.context_used || '',
          });
        }
      } catch (error) {
        // Handle network/connection errors
        console.error('Error sending message:', error);
        const errorMsg =
          error?.response?.data?.detail ||
          error?.response?.data?.error ||
          error?.message ||
          'Failed to connect to the server. Please try again.';

        messages.value.push({
          role: 'assistant',
          content: `Error: ${errorMsg}`,
          timestamp: new Date(),
        });
      } finally {
        // Always reset loading state and refocus
        sending.value = false;
        nextTick(() => {
          scrollToBottom();
          focusInput();
        });
      }
    };

    /**
     * scrollToBottom
     * --------------
     * Scrolls the messages container to show the latest message
     */
    const scrollToBottom = () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    };

    /**
     * focusInput
     * ----------
     * Focuses the input field for better UX
     */
    const focusInput = () => {
      if (inputRef.value) {
        inputRef.value.focus();
      }
    };

    /**
     * formatContent
     * -------------
     * Converts plain text message content to HTML with basic markdown support
     * - Converts \n to <br>
     * - Converts **text** to <strong>
     * - Converts *text* to <em>
     *
     * @param {string} content - The message content
     * @returns {string} HTML string (safe for v-html)
     */
    const formatContent = (content) => {
      if (!content) return '';
      return content
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic
    };

    /**
     * formatTime
     * ----------
     * Converts timestamp to HH:MM format for display
     *
     * @param {Date} timestamp - Message timestamp
     * @returns {string} Formatted time string (e.g., "14:30")
     */
    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    /**
     * getFileName
     * -----------
     * Extracts filename from a full file path
     *
     * @param {string} filePath - Full path to file (e.g., "/path/to/document.txt")
     * @returns {string} Filename only (e.g., "document.txt")
     */
    const getFileName = (filePath) => {
      if (!filePath) return 'Unknown';
      return filePath.split('/').pop();
    };

    // ==========================================================================
    // Lifecycle Hooks
    // ==========================================================================

    /**
     * onMounted
     * ---------
     * Runs after component is mounted to DOM
     * Ensures messages are scrolled to bottom on initial load
     */
    onMounted(() => {
      scrollToBottom();
    });

    // ==========================================================================
    // Public Interface
    // ==========================================================================
    // Expose state and methods to the template
    return {
      // State
      isOpen,
      messages,
      input,
      sending,
      messagesContainer,
      inputRef,
      // Methods
      toggleChat,
      sendMessage,
      formatContent,
      formatTime,
      getFileName,
    };
  },
};
</script>

<style scoped>
/* =============================================================================
   Design tokens
   ============================================================================= */
.chat-window,
.floating-button {
  --cb-primary: #4f46e5;
  --cb-primary-dark: #4338ca;
  --cb-secondary: #8b5cf6;
  --cb-accent: #10b981;
  --cb-ink: #16181f;
  --cb-ink-soft: #454a58;
  --cb-muted: #6b7280;
  --cb-border: #e8e9f2;
  --cb-surface-2: #f7f7fb;
  --cb-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
}

/* =============================================================================
   Floating Button
   ============================================================================= */
.floating-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--cb-primary) 0%, var(--cb-secondary) 100%);
  border: none;
  box-shadow: 0 10px 28px rgba(79, 70, 229, 0.38);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  z-index: 9999;
}

.floating-button:hover {
  transform: scale(1.08) translateY(-2px);
  box-shadow: 0 14px 34px rgba(79, 70, 229, 0.46);
}

.floating-button:active {
  transform: scale(0.96);
}

.chat-icon {
  width: 26px;
  height: 26px;
  color: white;
}

/* =============================================================================
   Chat Window
   ============================================================================= */
.chat-window {
  position: fixed;
  bottom: 100px;
  right: 24px;
  width: 400px;
  max-width: calc(100vw - 48px);
  min-height: 650px;
  max-height: 650px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 24px 60px -14px rgba(30, 27, 75, 0.32), 0 4px 16px rgba(30, 27, 75, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9999;
  font-family: var(--cb-font);
}

/* =============================================================================
   Header
   ============================================================================= */
.chat-header {
  background: linear-gradient(120deg, var(--cb-primary) 0%, var(--cb-secondary) 100%);
  color: white;
  padding: 16px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-icon svg {
  width: 21px;
  height: 21px;
  color: white;
}

.header-title {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.header-subtitle {
  font-size: 12px;
  opacity: 0.85;
  margin-top: 1px;
  font-weight: 400;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  opacity: 0.9;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  opacity: 1;
}

/* =============================================================================
   Messages Area
   ============================================================================= */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--cb-surface-2);
}

/* Custom scrollbar */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #d5d7e3;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #b7bad0;
}

/* =============================================================================
   Messages
   ============================================================================= */
.message {
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: slideIn 0.25s ease;
}

.message.user {
  align-items: flex-end;
}

.message.assistant {
  align-items: flex-start;
}

.message-bubble {
  max-width: 82%;
  padding: 11px 15px;
  border-radius: 14px;
  word-wrap: break-word;
  line-height: 1.5;
  font-size: 13px;
}

.message.user .message-bubble {
  background: linear-gradient(120deg, var(--cb-primary) 0%, var(--cb-secondary) 100%);
  color: white;
  border-bottom-right-radius: 4px;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
}

.message.assistant .message-bubble {
  background: white;
  color: var(--cb-ink);
  border: 1px solid var(--cb-border);
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 10.5px;
  color: var(--cb-muted);
  padding: 0 4px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =============================================================================
   Typing Indicator
   ============================================================================= */
.typing-message .message-bubble {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border: 1px solid var(--cb-border);
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: flex-end;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--cb-secondary);
  animation: bounce 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-8px);
  }
}

/* =============================================================================
   Document Sources
   ============================================================================= */
.message-sources {
  margin-top: 10px;
  font-size: 13px;
}

.sources-details {
  background: var(--cb-surface-2);
  border-radius: 10px;
  padding: 9px 12px;
  border-left: 3px solid var(--cb-primary);
  cursor: pointer;
}

.sources-summary {
  cursor: pointer;
  font-weight: 600;
  font-size: 12.5px;
  color: var(--cb-primary);
  user-select: none;
  list-style: none;
  outline: none;
}

.sources-summary:hover {
  color: var(--cb-primary-dark);
}

.sources-list {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.source-item {
  background: white;
  border-radius: 8px;
  padding: 9px 10px;
  border: 1px solid var(--cb-border);
  border-left: 3px solid var(--cb-accent);
}

.source-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.source-file {
  color: var(--cb-ink);
  font-size: 12px;
  font-weight: 700;
}

.source-preview {
  color: var(--cb-ink-soft);
  font-size: 11.5px;
  line-height: 1.5;
  margin: 0;
}

/* =============================================================================
   Metadata
   ============================================================================= */
.message-metadata {
  margin-top: 8px;
}

.metadata-badge {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--cb-primary);
  background: rgba(79, 70, 229, 0.08);
  padding: 3px 9px;
  border-radius: 999px;
  display: inline-block;
}

/* =============================================================================
   Input Area
   ============================================================================= */
.chat-input-area {
  padding: 14px 16px;
  background: white;
  border-top: 1px solid var(--cb-border);
  flex-shrink: 0;
}

.input-form {
  display: flex;
  gap: 8px;
  align-items: center;
}

.chat-input {
  flex: 1;
  background: var(--cb-surface-2);
  border: 1px solid var(--cb-border);
  border-radius: 999px;
  padding: 11px 16px;
  color: var(--cb-ink);
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: all 0.2s;
}

.chat-input:focus {
  border-color: var(--cb-primary);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.13);
  background: white;
}

.chat-input::placeholder {
  color: var(--cb-muted);
}

.chat-input:disabled {
  background: #f3f4f6;
  opacity: 0.6;
  cursor: not-allowed;
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--cb-primary) 0%, var(--cb-secondary) 100%);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
  padding: 0;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.send-btn:hover:not(:disabled) {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.send-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

.send-icon {
  width: 18px;
  height: 18px;
  color: white;
}

/* =============================================================================
   Animations
   ============================================================================= */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(24px) scale(0.98);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(24px) scale(0.98);
}

/* =============================================================================
   Responsive Design
   ============================================================================= */
@media (max-width: 600px) {
  .chat-window {
    width: 100%;
    max-width: calc(100vw - 24px);
    bottom: 0;
    right: 12px;
    max-height: 80vh;
    min-height: auto;
    border-radius: 20px 20px 0 0;
  }

  .floating-button {
    bottom: 16px;
    right: 16px;
  }
}
</style>
