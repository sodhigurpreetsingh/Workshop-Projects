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
      <div v-if="isOpen" class="chat-window" aria-live="polite">
        <!-- Header -->
        <div class="chat-header">
          <div class="header-content">
            <div class="header-icon">
              <!-- Inline SVG mark — no external logo asset required -->
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L2 8l10 5 8-4.09V17h2V8L12 3z" fill="currentColor" />
                <path d="M6 10.5V15c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5l-6 3-6-3z" fill="currentColor" opacity="0.55" />
              </svg>
            </div>
            <div class="header-text">
              <div class="header-title">CU Campus Assistant</div>
              <div class="header-subtitle">Ask me about CU</div>
            </div>
          </div>
          <div class="header-actions">
            <button class="new-session-btn" @click="confirmNewSession" title="Start new conversation">+</button>
            <button class="close-btn" @click="toggleChat" aria-label="Close chat">✕</button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="nav-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['nav-tab', { active: activeTab === tab.id }]"
            @click="selectTab(tab.id)"
          >
            <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" v-html="tab.icon"></svg>
            <span class="tab-label">{{ tab.label }}</span>
          </button>
        </div>

        <!-- Sub-tabs (predefined questions) -->
        <transition name="slide-down">
          <div v-if="activeTab && activeSubtabs.length > 0" class="sub-tabs">
            <button
              v-for="subtab in activeSubtabs"
              :key="subtab.id"
              :class="['sub-tab', { active: activeSubTab === subtab.id }]"
              @click="selectSubTab(subtab)"
            >
              {{ subtab.label }}
            </button>
          </div>
        </transition>

        <!-- Messages area -->
        <div ref="messagesContainer" class="chat-messages">
          <!-- Loading indicator while fetching history -->
          <div v-if="loadingHistory" class="history-loading">
            <div class="typing-indicator"><span></span><span></span><span></span></div>
            <span class="loading-text">Loading conversation history...</span>
          </div>

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
                        <strong class="source-file">{{ source.title || source.doc_id }}</strong>
                        <span v-if="source.category" class="source-category">{{ source.category }}</span>
                      </div>
                    </div>
                  </div>
                </details>
              </div>

              <!-- Smart CTA button -->
              <button v-if="msg.role === 'assistant' && msg.action" class="cta-button" @click="handleAction(msg.action)">
                {{ msg.action.buttonText }}
              </button>

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
            <button
              v-if="speechSupported"
              type="button"
              class="voice-btn"
              :class="{ recording: isRecording }"
              @click="toggleVoiceRecording"
              :disabled="sending"
              :title="isRecording ? 'Stop recording' : 'Start voice input'"
            >
              <svg v-if="!isRecording" class="mic-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
              <svg v-else class="stop-icon" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </button>
            <button
              v-if="voiceState === 'preview'"
              type="button"
              class="voice-cancel-btn"
              @click="cancelVoiceInput"
              title="Cancel voice input"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <input
              ref="inputRef"
              v-model="input"
              type="text"
              class="chat-input"
              :placeholder="isRecording ? 'Listening...' : 'Ask about programs, placements, fees, hostel...'"
              :disabled="sending || isRecording"
            />
            <button type="submit" class="send-btn" :disabled="sending || !input.trim() || isRecording">
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
 * A Vue 3 component providing a floating chat interface for RAG (Retrieval
 * Augmented Generation) queries about Chandigarh University.
 *
 * Features:
 * - Floating button UI + full chat window
 * - Guided tab navigation with predefined questions per category
 * - Voice input (Web Speech API)
 * - Session persistence — history survives a page reload via /chat/history
 * - Smart CTA buttons (Apply Now / Scholarship details / Call Admissions)
 * - Markdown rendering (bold, lists) via marked + DOMPurify
 *
 * API Integration:
 * - POST /api/v1/chat/ask    { question, session_id } -> { answer, sources, action, metadata }
 * - GET  /api/v1/chat/history?session_id=... -> { messages: [{question, answer, sources, action, timestamp}] }
 */

import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import myAxios from '../utils/my-axios.js';

marked.setOptions({ breaks: true, gfm: true });

const SESSION_STORAGE_KEY = 'cu_chatbot_session_id';
const WELCOME_MESSAGE =
  "Welcome to Chandigarh University! 🎓 I'm your CU Campus Assistant. Ask me anything about programs, placements, fees, scholarships, hostel, or campus life. How can I help you today?";

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getOrCreateSessionId() {
  if (typeof localStorage === 'undefined') return generateUUID();
  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) {
    sessionId = generateUUID();
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  return sessionId;
}

export default {
  name: 'ChatbotSimple',
  setup() {
    // ==========================================================================
    // Reactive State
    // ==========================================================================
    const isOpen = ref(false);
    const sessionId = ref(getOrCreateSessionId());
    const loadingHistory = ref(false);
    const historyLoaded = ref(false);

    const messages = ref([
      { role: 'assistant', content: WELCOME_MESSAGE, timestamp: new Date() },
    ]);

    const input = ref('');
    const sending = ref(false);
    const messagesContainer = ref(null);
    const inputRef = ref(null);

    // Voice recording state (Web Speech API)
    const voiceState = ref('idle'); // 'idle' | 'listening' | 'preview'
    const speechSupported = ref(false);
    let recognition = null;
    let accumulatedFinalTranscript = '';
    const isRecording = computed(() => voiceState.value === 'listening');

    // Tab navigation state
    const activeTab = ref(null);
    const activeSubTab = ref(null);

    // Tabs config — predefined questions mapped to the 5 CU knowledge categories
    const tabs = ref([
      {
        id: 'programs',
        label: 'Programs',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />',
        subtabs: [
          { id: 'engineering', label: 'Engineering (B.Tech)', prompt: 'What B.Tech and engineering specializations does CU offer?' },
          { id: 'mba', label: 'MBA & Management', prompt: 'What MBA specializations are available at CU?' },
          { id: 'computing', label: 'BCA / MCA', prompt: 'Tell me about the BCA and MCA computing programs at CU.' },
          { id: 'other', label: 'Other Programs', prompt: 'What other programs does CU offer besides engineering and management?' },
        ],
      },
      {
        id: 'admissions',
        label: 'Admissions',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />',
        subtabs: [
          { id: 'process', label: 'Admission Process', prompt: 'What is the admission process at CU?' },
          { id: 'cucet', label: 'CUCET Exam', prompt: 'What is CUCET and how does it work?' },
          { id: 'documents', label: 'Documents Required', prompt: 'What documents do I need for CU admission?' },
          { id: 'apply', label: 'Apply & Contact', prompt: 'How do I apply and who do I contact for admissions?' },
        ],
      },
      {
        id: 'placements',
        label: 'Placements',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />',
        subtabs: [
          { id: 'stats', label: 'Placement Stats', prompt: "What are CU's placement statistics for 2024-25?" },
          { id: 'recruiters', label: 'Top Recruiters', prompt: 'Which companies recruit from CU?' },
          { id: 'package', label: 'Highest Package', prompt: 'What is the highest package offered at CU?' },
        ],
      },
      {
        id: 'campus',
        label: 'Campus Life',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />',
        subtabs: [
          { id: 'overview', label: 'Campus Overview', prompt: 'Tell me about the CU campus and location.' },
          { id: 'rankings', label: 'Rankings & Accreditation', prompt: "What are CU's rankings and accreditations?" },
          { id: 'hostel', label: 'Hostel Facilities', prompt: 'What hostel facilities and fees does CU offer?' },
          { id: 'clubs', label: 'Clubs & Festivals', prompt: 'What clubs, festivals and campus life does CU have?' },
        ],
      },
      {
        id: 'scholarships',
        label: 'Scholarships',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />',
        subtabs: [
          { id: 'cucet_scholarship', label: 'CUCET Scholarship', prompt: 'How does the CUCET scholarship work?' },
          { id: 'merit', label: 'Merit Scholarship', prompt: 'What merit-based scholarships are available at CU?' },
          { id: 'sports', label: 'Sports Scholarship', prompt: 'Are there scholarships for sports achievers at CU?' },
          { id: 'need_based', label: 'Need-Based Aid', prompt: 'What financial aid options exist for need-based students?' },
        ],
      },
    ]);

    const activeSubtabs = computed(() => {
      if (!activeTab.value) return [];
      const tab = tabs.value.find((t) => t.id === activeTab.value);
      return tab ? tab.subtabs : [];
    });

    const selectTab = (tabId) => {
      if (activeTab.value === tabId) {
        activeTab.value = null;
        activeSubTab.value = null;
      } else {
        activeTab.value = tabId;
        activeSubTab.value = null;
      }
    };

    const selectSubTab = (subtab) => {
      activeSubTab.value = subtab.id;
      if (subtab.prompt && !sending.value) {
        submitQuestion(subtab.prompt);
      }
    };

    // ==========================================================================
    // Core send/receive
    // ==========================================================================
    const submitQuestion = async (question) => {
      if (!question || sending.value) return;

      messages.value.push({ role: 'user', content: question, timestamp: new Date() });
      nextTick(() => scrollToBottom());

      sending.value = true;

      try {
        const response = await myAxios.post('/chat/ask', {
          question,
          session_id: sessionId.value,
        });

        const data = response.data;

        if (!data) {
          messages.value.push({ role: 'assistant', content: 'No response from server. Please try again.', timestamp: new Date() });
        } else if (!data.success) {
          messages.value.push({ role: 'assistant', content: data.answer || 'An error occurred. Please try again.', timestamp: new Date() });
        } else {
          messages.value.push({
            role: 'assistant',
            content: data.answer,
            timestamp: new Date(),
            sources: data.sources || [],
            action: data.action || null,
            metadata: data.metadata || {},
          });
        }
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMsg =
          error?.response?.data?.detail || error?.response?.data?.error || error?.message || 'Failed to connect to the server. Please try again.';
        messages.value.push({ role: 'assistant', content: `Error: ${errorMsg}`, timestamp: new Date() });
      } finally {
        sending.value = false;
        nextTick(() => {
          scrollToBottom();
          focusInput();
        });
      }
    };

    const sendMessage = async () => {
      const question = input.value.trim();
      if (!question) return;
      input.value = '';
      await submitQuestion(question);
    };

    // ==========================================================================
    // Session history
    // ==========================================================================
    const loadSessionHistory = async () => {
      if (historyLoaded.value || loadingHistory.value) return;

      loadingHistory.value = true;
      try {
        const resp = await myAxios.get('/chat/history', { params: { session_id: sessionId.value } });

        if (resp.data && resp.data.success && resp.data.messages && resp.data.messages.length > 0) {
          const historyMessages = resp.data.messages.flatMap((turn) => {
            const ts = turn.timestamp ? new Date(turn.timestamp) : new Date();
            return [
              { role: 'user', content: turn.question, timestamp: ts },
              {
                role: 'assistant',
                content: turn.answer,
                timestamp: ts,
                sources: turn.sources || [],
                action: turn.action || null,
              },
            ];
          });

          messages.value = [
            { role: 'assistant', content: WELCOME_MESSAGE, timestamp: historyMessages[0]?.timestamp || new Date() },
            ...historyMessages,
          ];
        }
      } catch (err) {
        console.error('Failed to load session history:', err);
      } finally {
        loadingHistory.value = false;
        historyLoaded.value = true;
        nextTick(() => scrollToBottom());
      }
    };

    const confirmNewSession = () => {
      const confirmed = window.confirm(
        'Start a new conversation? Your previous messages in this session will no longer appear in this chat.'
      );
      if (confirmed) startNewSession();
    };

    const startNewSession = () => {
      if (voiceState.value !== 'idle') cancelVoiceInput();

      const newSessionId = generateUUID();
      sessionId.value = newSessionId;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
      }

      messages.value = [{ role: 'assistant', content: WELCOME_MESSAGE, timestamp: new Date() }];
      historyLoaded.value = false;
      activeTab.value = null;
      activeSubTab.value = null;

      nextTick(() => {
        scrollToBottom();
        focusInput();
      });
    };

    // ==========================================================================
    // Smart CTA actions
    // ==========================================================================
    const handleAction = (action) => {
      if (!action || !action.url) return;
      if (action.url.startsWith('tel:') || action.url.startsWith('mailto:')) {
        window.location.href = action.url;
      } else {
        window.open(action.url, '_blank', 'noopener,noreferrer');
      }
    };

    // ==========================================================================
    // Open/close, scrolling, formatting
    // ==========================================================================
    const toggleChat = () => {
      isOpen.value = !isOpen.value;
      if (isOpen.value) {
        loadSessionHistory();
        nextTick(() => {
          scrollToBottom();
          focusInput();
        });
      }
    };

    const scrollToBottom = () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    };

    const focusInput = () => {
      if (inputRef.value) inputRef.value.focus();
    };

    const formatContent = (content) => {
      if (!content) return '';
      const rawHtml = marked.parse(content);
      return DOMPurify.sanitize(rawHtml);
    };

    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    // ==========================================================================
    // Voice input (Web Speech API)
    // ==========================================================================
    const initSpeechRecognition = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        speechSupported.value = false;
        return;
      }
      speechSupported.value = true;

      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            accumulatedFinalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        input.value = accumulatedFinalTranscript + interimTranscript;
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          messages.value.push({
            role: 'assistant',
            content: 'Microphone access was denied. Please allow microphone permissions in your browser settings and try again.',
            timestamp: new Date(),
          });
          nextTick(() => scrollToBottom());
        } else if (event.error === 'network') {
          messages.value.push({
            role: 'assistant',
            content: 'Network error during speech recognition. Please check your connection and try again.',
            timestamp: new Date(),
          });
          nextTick(() => scrollToBottom());
        }
        voiceState.value = 'idle';
      };

      recognition.onend = () => {
        if (voiceState.value === 'listening') {
          voiceState.value = input.value && input.value.trim() ? 'preview' : 'idle';
        }
      };
    };

    const toggleVoiceRecording = () => {
      if (sending.value) return;

      if (!speechSupported.value) {
        messages.value.push({
          role: 'assistant',
          content: 'Voice input is not supported in this browser. Please use Chrome, Edge, or Safari 17+ for voice features.',
          timestamp: new Date(),
        });
        nextTick(() => scrollToBottom());
        return;
      }

      if (voiceState.value === 'idle' || voiceState.value === 'preview') {
        accumulatedFinalTranscript = '';
        input.value = '';
        voiceState.value = 'listening';
        try {
          recognition.start();
        } catch (e) {
          console.error('Speech recognition start error:', e);
          voiceState.value = 'idle';
        }
      } else if (voiceState.value === 'listening') {
        recognition.stop();
        voiceState.value = input.value && input.value.trim() ? 'preview' : 'idle';
      }
    };

    const cancelVoiceInput = () => {
      if (voiceState.value === 'listening') {
        recognition.abort();
      }
      input.value = '';
      accumulatedFinalTranscript = '';
      voiceState.value = 'idle';
    };

    // ==========================================================================
    // Homepage "try asking..." integration
    // ==========================================================================
    const handleExternalAsk = (event) => {
      const prompt = event?.detail;
      if (!prompt) return;
      if (!isOpen.value) {
        isOpen.value = true;
        loadSessionHistory();
      }
      nextTick(() => {
        scrollToBottom();
        submitQuestion(prompt);
      });
    };

    // ==========================================================================
    // Lifecycle
    // ==========================================================================
    onMounted(() => {
      initSpeechRecognition();
      window.addEventListener('cu-chatbot:ask', handleExternalAsk);
      nextTick(() => scrollToBottom());
    });

    onUnmounted(() => {
      if (recognition && voiceState.value === 'listening') recognition.abort();
      window.removeEventListener('cu-chatbot:ask', handleExternalAsk);
    });

    return {
      isOpen,
      messages,
      input,
      sending,
      messagesContainer,
      inputRef,
      toggleChat,
      sendMessage,
      formatContent,
      formatTime,
      // Session
      loadingHistory,
      confirmNewSession,
      // Tabs
      tabs,
      activeTab,
      activeSubTab,
      activeSubtabs,
      selectTab,
      selectSubTab,
      // CTA
      handleAction,
      // Voice
      voiceState,
      speechSupported,
      isRecording,
      toggleVoiceRecording,
      cancelVoiceInput,
    };
  },
};
</script>

<style scoped>
/* =============================================================================
   Design tokens — matches CU brand (maroon + gold)
   ============================================================================= */
.chat-window,
.floating-button {
  --cb-primary:     #8B0000;
  --cb-primary-dark:#6B0000;
  --cb-secondary:   #A52020;
  --cb-accent:      #C9A84C;
  --cb-accent-dark: #b8943a;
  --cb-ink:         #1a1f2e;
  --cb-ink-soft:    #4a5568;
  --cb-muted:       #718096;
  --cb-border:      #e2e8f0;
  --cb-surface-2:   #f7f8fc;
  --cb-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
}

/* =============================================================================
   Floating Button
   ============================================================================= */
.floating-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--cb-primary) 0%, var(--cb-secondary) 100%);
  border: none;
  box-shadow: 0 10px 28px rgba(139, 0, 0, 0.42);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  z-index: 9999;
}

.floating-button:hover {
  transform: scale(1.08) translateY(-2px);
  box-shadow: 0 14px 34px rgba(139, 0, 0, 0.52);
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
  width: 420px;
  max-width: calc(100vw - 48px);
  min-height: 680px;
  max-height: 680px;
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
  padding: 18px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  border-bottom: 3px solid var(--cb-accent);
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.new-session-btn {
  background: none;
  border: none;
  color: white;
  font-size: 22px;
  font-weight: 300;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.2s;
  opacity: 0.9;
}

.new-session-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  opacity: 1;
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
   Navigation Tabs
   ============================================================================= */
.nav-tabs {
  display: flex;
  background: var(--cb-surface-2);
  border-bottom: 1px solid var(--cb-border);
  flex-shrink: 0;
}

.nav-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 9px 2px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 3px;
  border-bottom: 2px solid transparent;
}

.nav-tab:hover {
  background: rgba(139, 0, 0, 0.05);
}

.nav-tab.active {
  background: white;
  border-bottom-color: var(--cb-primary);
}

.tab-icon {
  width: 18px;
  height: 18px;
  color: var(--cb-muted);
  transition: color 0.2s;
}

.nav-tab.active .tab-icon {
  color: var(--cb-primary);
}

.nav-tab:hover .tab-icon {
  color: var(--cb-primary);
}

.tab-label {
  font-size: 9.5px;
  font-weight: 600;
  color: var(--cb-muted);
  text-align: center;
  line-height: 1.15;
  transition: color 0.2s;
}

.nav-tab.active .tab-label {
  color: var(--cb-primary);
}

/* =============================================================================
   Sub-tabs
   ============================================================================= */
.sub-tabs {
  display: flex;
  flex-wrap: wrap;
  background: white;
  border-bottom: 1px solid var(--cb-border);
  padding: 8px;
  gap: 6px;
  flex-shrink: 0;
}

.sub-tab {
  padding: 6px 12px;
  background: var(--cb-surface-2);
  border: 1px solid var(--cb-border);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 11px;
  font-weight: 500;
  color: var(--cb-ink-soft);
}

.sub-tab:hover {
  background: #f0e6e6;
  border-color: var(--cb-primary);
  color: var(--cb-primary);
}

.sub-tab.active {
  background: var(--cb-primary);
  border-color: var(--cb-primary);
  color: white;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 100px;
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

/* History loading indicator */
.history-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: white;
  border: 1px solid var(--cb-border);
  border-radius: 12px;
}

.loading-text {
  font-size: 11.5px;
  color: var(--cb-muted);
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
  box-shadow: 0 4px 12px rgba(139, 0, 0, 0.25);
}

.message.assistant .message-bubble {
  background: white;
  color: var(--cb-ink);
  border: 1px solid var(--cb-border);
  border-bottom-left-radius: 4px;
}

/* Markdown content rendered via v-html (bold, lists, paragraphs from LLM answers) */
.message-bubble :deep(p) {
  margin: 0 0 8px 0;
}

.message-bubble :deep(p:last-child) {
  margin-bottom: 0;
}

.message-bubble :deep(strong) {
  font-weight: 700;
}

.message-bubble :deep(ul),
.message-bubble :deep(ol) {
  margin: 4px 0 8px 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-bubble :deep(li) {
  line-height: 1.5;
}

.message-bubble :deep(ul:last-child),
.message-bubble :deep(ol:last-child) {
  margin-bottom: 0;
}

.message-bubble :deep(a) {
  color: inherit;
  text-decoration: underline;
}

.message-bubble :deep(code) {
  background: rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  padding: 1px 5px;
  font-size: 12px;
}

.message.user .message-bubble :deep(code) {
  background: rgba(255, 255, 255, 0.2);
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
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--cb-primary);
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
  border-left: 3px solid var(--cb-accent);
  cursor: pointer;
}

.sources-summary {
  cursor: pointer;
  font-weight: 600;
  font-size: 12.5px;
  color: var(--cb-accent-dark);
  user-select: none;
  list-style: none;
  outline: none;
}

.sources-summary:hover {
  color: #c94418;
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
  gap: 8px;
}

.source-file {
  color: var(--cb-ink);
  font-size: 12px;
  font-weight: 700;
}

.source-category {
  font-size: 10px;
  font-weight: 600;
  color: var(--cb-accent-dark);
  background: rgba(201, 168, 76, 0.14);
  padding: 2px 8px;
  border-radius: 999px;
  text-transform: capitalize;
  white-space: nowrap;
}

/* =============================================================================
   Smart CTA button
   ============================================================================= */
.cta-button {
  display: inline-flex;
  align-items: center;
  margin-top: 10px;
  padding: 8px 16px;
  background: var(--cb-accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 3px 10px rgba(201, 168, 76, 0.35);
}

.cta-button:hover {
  background: var(--cb-accent-dark);
  transform: translateY(-1px);
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
  background: rgba(139, 0, 0, 0.08);
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
  box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.12);
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
  border-radius: 10px;
  background: var(--cb-accent);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
  padding: 0;
  box-shadow: 0 4px 12px rgba(201, 168, 76, 0.38);
}

.send-btn:hover:not(:disabled) {
  background: var(--cb-accent-dark);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(201, 168, 76, 0.48);
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
   Voice button
   ============================================================================= */
.voice-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--cb-border);
  background: var(--cb-surface-2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cb-ink-soft);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  padding: 0;
}

.voice-btn:hover:not(:disabled) {
  background: #f0e6e6;
  color: var(--cb-primary);
}

.voice-btn.recording {
  background: linear-gradient(135deg, var(--cb-primary) 0%, var(--cb-secondary) 100%);
  color: white;
  border-color: var(--cb-primary);
  animation: pulse 1.5s infinite;
}

.voice-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.mic-icon {
  width: 20px;
  height: 20px;
}

.stop-icon {
  width: 16px;
  height: 16px;
}

.voice-cancel-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(139, 0, 0, 0.3);
  background: rgba(139, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cb-primary);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  padding: 0;
}

.voice-cancel-btn svg {
  width: 14px;
  height: 14px;
}

.voice-cancel-btn:hover {
  background: rgba(139, 0, 0, 0.14);
  border-color: var(--cb-primary);
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(139, 0, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(139, 0, 0, 0);
  }
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
    max-height: 82vh;
    min-height: auto;
    border-radius: 20px 20px 0 0;
  }

  .floating-button {
    bottom: 16px;
    right: 16px;
  }

  .voice-btn {
    width: 36px;
    height: 36px;
  }
}
</style>
