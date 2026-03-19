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
              <img src="../images/logo.png" alt="SVIET Logo" class="sviet-logo" />
            </div>
            <div class="header-text">
              <div class="header-title">SVIET Assistant</div>
              <div class="header-subtitle">Ask anything about SVIET</div>
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
 * - PDF source citations display
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
     * - sources: Array of PDF sources (assistant only)
     * - metadata: Execution time and other stats (assistant only)
     */
    const messages = ref([
      {
        role: 'assistant',
        content: 'Welcome to SVIET! 🎓 I can help answer questions about our programs, placements, facilities, and campus life. What would you like to know?',
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
     * @param {string} filePath - Full path to file (e.g., "/path/to/document.pdf")
     * @returns {string} Filename only (e.g., "document.pdf")
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
   Floating Button
   ============================================================================= */
.floating-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 9999;
}

.floating-button:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
  background: linear-gradient(135deg, #5568d3 0%, #6a3e94 100%);
}

.floating-button:active {
  transform: scale(0.95);
}

.chat-icon {
  width: 28px;
  height: 28px;
  color: white;
}

/* =============================================================================
   Chat Window
   ============================================================================= */
.chat-window {
  position: fixed;
  bottom: 100px;
  right: 24px;
  width: 600px;
  max-width: calc(100vw - 48px);
  min-height: 650px;
  max-height: 650px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
}

/* =============================================================================
   Header
   ============================================================================= */
.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sviet-logo {
  width: 40px;
  height: 48px;
  object-fit: contain;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.3px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
}

.header-subtitle {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 2px;
  font-weight: 400;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
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
  background: white;
}

/* Custom scrollbar */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0;
}

/* =============================================================================
   Messages
   ============================================================================= */
.message {
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: slideIn 0.3s ease;
}

.message.user {
  align-items: flex-end;
}

.message.assistant {
  align-items: flex-start;
}

.message-bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
  word-wrap: break-word;
  line-height: 1.4;
  font-size: 13px;
}

.message.user .message-bubble {
  background: #003D82;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.assistant .message-bubble {
  background: #f5f5f5;
  color: #003D82;
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 11px;
  color: #999;
  padding: 0 4px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
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
  padding: 8px 16px;
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
  background: #999;
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
   PDF Sources
   ============================================================================= */
.message-sources {
  margin-top: 12px;
  font-size: 13px;
}

.sources-details {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 10px 12px;
  border-left: 3px solid #E8731E;
  cursor: pointer;
}

.sources-summary {
  cursor: pointer;
  font-weight: 600;
  color: #003D82;
  user-select: none;
  list-style: none;
  outline: none;
}

.sources-summary:hover {
  color: #404040;
}

.sources-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.source-item {
  background: white;
  border-radius: 6px;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-left: 3px solid #E8731E;
}

.source-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.source-file {
  color: #003D82;
  font-size: 13px;
  font-weight: 600;
}

.source-preview {
  color: #555;
  font-size: 12px;
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
  font-size: 11px;
  color: #666;
  background: #e8e8e8;
  padding: 4px 10px;
  border-radius: 12px;
  display: inline-block;
}

/* =============================================================================
   Input Area
   ============================================================================= */
.chat-input-area {
  padding: 16px;
  background: white;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.input-form {
  display: flex;
  gap: 8px;
  align-items: center;
}

.chat-input {
  flex: 1;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 999px;
  padding: 12px 16px;
  color: #003D82;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: all 0.2s;
}

.chat-input:focus {
  border-color: #E8731E;
  box-shadow: 0 0 0 3px rgba(232, 115, 30, 0.15);
  background: white;
}

.chat-input::placeholder {
  color: #9ca3af;
}

.chat-input:disabled {
  background: #f3f4f6;
  opacity: 0.6;
  cursor: not-allowed;
}

.send-btn {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: #003D82;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
  padding: 0;
}

.send-btn:hover:not(:disabled) {
  background: #0052A3;
}

.send-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.send-icon {
  width: 20px;
  height: 20px;
  color: white;
}

/* =============================================================================
   Animations
   ============================================================================= */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
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
    border-radius: 16px 16px 0 0;
  }

  .floating-button {
    bottom: 16px;
    right: 16px;
  }
}
</style>
