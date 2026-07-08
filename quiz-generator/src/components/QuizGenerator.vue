<template>
  <div class="qg-page">

    <!-- ── Header ── -->
    <header class="qg-header">
      <div class="qg-header-inner">
        <div class="qg-brand">
          <div class="qg-brand-mark">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="9" fill="#003580"/>
              <text x="18" y="24" text-anchor="middle" font-size="18" font-weight="bold" fill="white" font-family="Arial">?</text>
            </svg>
          </div>
          <div>
            <div class="qg-brand-name">AI Quiz Generator</div>
            <div class="qg-brand-sub">Powered by GPT · Instant MCQs</div>
          </div>
        </div>
        <div class="qg-header-badge">
          <span class="badge-dot"></span>
          Free to use
        </div>
      </div>
    </header>

    <!-- ── Main ── -->
    <main class="qg-main">

      <!-- ── SETUP SCREEN ── -->
      <div v-if="screen === 'setup'" class="qg-card">
        <div class="qg-intro">
          <h1>Generate a Quiz from Any Topic</h1>
          <p>Type a topic name or paste your study notes — AI will generate multiple-choice questions with answers and explanations.</p>
        </div>

        <!-- Topic input -->
        <div class="form-group">
          <label class="form-label">Topic or Study Notes</label>
          <textarea
            v-model="topic"
            class="qg-textarea"
            rows="5"
            placeholder="e.g. 'Python functions and loops' or paste your lecture notes here…"
            maxlength="2000"
          ></textarea>
          <div class="char-count">{{ topic.length }} / 2000</div>
        </div>

        <!-- Controls row -->
        <div class="controls-row">
          <div class="control-group">
            <label class="form-label">Number of Questions</label>
            <div class="num-selector">
              <button class="num-btn" @click="numQuestions = Math.max(3, numQuestions - 1)">−</button>
              <span class="num-display">{{ numQuestions }}</span>
              <button class="num-btn" @click="numQuestions = Math.min(10, numQuestions + 1)">+</button>
            </div>
          </div>

          <div class="control-group">
            <label class="form-label">Difficulty</label>
            <div class="difficulty-tabs">
              <button
                v-for="d in difficulties"
                :key="d.value"
                class="diff-tab"
                :class="{ active: difficulty === d.value, [d.cls]: true }"
                @click="difficulty = d.value"
              >{{ d.label }}</button>
            </div>
          </div>
        </div>

        <div v-if="error" class="qg-error"><span>⚠</span> {{ error }}</div>

        <button class="qg-generate-btn" :disabled="!topic.trim()" @click="generate">
          <span v-if="topic.trim()">Generate {{ numQuestions }} Questions →</span>
          <span v-else>Enter a topic to continue</span>
        </button>

        <!-- Example topics -->
        <div class="examples">
          <span class="examples-label">Try:</span>
          <button v-for="ex in examples" :key="ex" class="example-chip" @click="topic = ex">{{ ex }}</button>
        </div>
      </div>

      <!-- ── LOADING SCREEN ── -->
      <div v-if="screen === 'loading'" class="qg-card qg-loading">
        <div class="loader-ring"></div>
        <h2>Generating your quiz…</h2>
        <p>AI is crafting {{ numQuestions }} {{ difficulty }} questions about <strong>{{ shortTopic }}</strong></p>
        <div class="loader-steps">
          <div class="loader-step" :class="{ active: loadStep >= 1 }">Reading topic</div>
          <div class="loader-step" :class="{ active: loadStep >= 2 }">Writing questions</div>
          <div class="loader-step" :class="{ active: loadStep >= 3 }">Adding explanations</div>
        </div>
      </div>

      <!-- ── QUIZ SCREEN ── -->
      <div v-if="screen === 'quiz'">

        <!-- Top bar -->
        <div class="quiz-topbar">
          <div>
            <h2>{{ shortTopic }}</h2>
            <p class="quiz-meta">
              {{ questions.length }} questions &nbsp;·&nbsp;
              <span :class="`diff-label-${difficulty.toLowerCase()}`">{{ difficulty }}</span>
              &nbsp;·&nbsp; {{ answeredCount }}/{{ questions.length }} answered
            </p>
          </div>
          <div class="quiz-topbar-actions">
            <button v-if="allAnswered && !showResults" class="btn-results" @click="showResults = true">
              See Results →
            </button>
            <button class="btn-reset" @click="reset">New Quiz</button>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: (answeredCount / questions.length * 100) + '%' }"></div>
        </div>

        <!-- Results summary -->
        <div v-if="showResults" class="results-summary" :class="summaryClass">
          <div class="results-score">
            <strong>{{ correctCount }}</strong> / {{ questions.length }}
          </div>
          <div class="results-info">
            <div class="results-title">{{ summaryLabel }}</div>
            <div class="results-sub">{{ Math.round(correctCount / questions.length * 100) }}% correct</div>
          </div>
        </div>

        <!-- Questions -->
        <div class="questions-list">
          <div
            v-for="(q, qi) in questions"
            :key="qi"
            class="question-card"
            :class="{ answered: userAnswers[qi] !== undefined }"
          >
            <div class="q-number">Q{{ qi + 1 }}</div>
            <div class="q-body">
              <p class="q-text">{{ q.question }}</p>

              <div class="options-grid">
                <button
                  v-for="(text, letter) in q.options"
                  :key="letter"
                  class="option-btn"
                  :class="getOptionClass(qi, letter)"
                  :disabled="userAnswers[qi] !== undefined"
                  @click="answer(qi, letter)"
                >
                  <span class="option-letter">{{ letter }}</span>
                  <span class="option-text">{{ text }}</span>
                </button>
              </div>

              <!-- Explanation (shown after answering) -->
              <transition name="fade">
                <div v-if="userAnswers[qi] !== undefined" class="explanation">
                  <div class="explanation-icon">
                    {{ userAnswers[qi] === q.answer ? '✓' : '✗' }}
                  </div>
                  <div>
                    <strong>{{ userAnswers[qi] === q.answer ? 'Correct!' : `Correct answer: ${q.answer} — ${q.options[q.answer]}` }}</strong>
                    <p>{{ q.explanation }}</p>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- Bottom actions -->
        <div class="quiz-bottom">
          <button v-if="allAnswered && !showResults" class="btn-results-lg" @click="showResults = true">
            See Final Score →
          </button>
          <button class="btn-reset-lg" @click="reset">Generate Another Quiz</button>
        </div>

      </div>
    </main>

    <!-- ── Footer ── -->
    <footer class="qg-footer">
      AI Quiz Generator &nbsp;·&nbsp; Powered by OpenAI GPT &nbsp;·&nbsp; For educational demo purposes
    </footer>

  </div>
</template>

<script>
import { ref, computed, onBeforeUnmount } from 'vue';
import myAxios from '../utils/my-axios.js';

export default {
  name: 'QuizGenerator',
  setup() {
    /* ── State ── */
    const screen      = ref('setup');   // 'setup' | 'loading' | 'quiz'
    const topic       = ref('');
    const numQuestions = ref(5);
    const difficulty  = ref('Medium');
    const questions   = ref([]);
    const userAnswers = ref({});        // { questionIndex: 'A'|'B'|'C'|'D' }
    const showResults = ref(false);
    const error       = ref('');
    const loadStep    = ref(0);

    let stepTimer = null;

    const difficulties = [
      { value: 'Easy',   label: 'Easy',   cls: 'easy'   },
      { value: 'Medium', label: 'Medium', cls: 'medium' },
      { value: 'Hard',   label: 'Hard',   cls: 'hard'   },
    ];

    const examples = [
      'Python functions and loops',
      'Photosynthesis in plants',
      'World War II causes',
      'Basics of machine learning',
      'Newton\'s laws of motion',
    ];

    /* ── Computed ── */
    const shortTopic = computed(() => {
      const t = topic.value.trim();
      return t.length > 60 ? t.slice(0, 60) + '…' : t;
    });

    const answeredCount = computed(() => Object.keys(userAnswers.value).length);
    const allAnswered   = computed(() => answeredCount.value === questions.value.length && questions.value.length > 0);

    const correctCount = computed(() =>
      Object.entries(userAnswers.value).filter(([qi, ans]) => ans === questions.value[qi]?.answer).length
    );

    const summaryClass = computed(() => {
      if (!questions.value.length) return '';
      const pct = correctCount.value / questions.value.length;
      if (pct >= 0.8) return 'summary-green';
      if (pct >= 0.5) return 'summary-amber';
      return 'summary-red';
    });

    const summaryLabel = computed(() => {
      if (!questions.value.length) return '';
      const pct = correctCount.value / questions.value.length;
      if (pct >= 0.8) return '🎉 Excellent work!';
      if (pct >= 0.5) return '👍 Good effort — review the ones you missed.';
      return '📖 Keep studying — you\'ll get there!';
    });

    /* ── Methods ── */
    const startLoadSteps = () => {
      loadStep.value = 1;
      stepTimer = setInterval(() => {
        if (loadStep.value < 3) loadStep.value++;
        else clearInterval(stepTimer);
      }, 1500);
    };

    const generate = async () => {
      if (!topic.value.trim()) return;
      error.value = '';
      screen.value = 'loading';
      startLoadSteps();

      try {
        const res = await myAxios.post('/quiz/generate', {
          topic: topic.value.trim(),
          num_questions: numQuestions.value,
          difficulty: difficulty.value,
        });

        if (res.data.success && res.data.questions?.length) {
          questions.value  = res.data.questions;
          userAnswers.value = {};
          showResults.value = false;
          screen.value = 'quiz';
        } else {
          error.value = res.data.message || 'Generation failed. Please try again.';
          screen.value = 'setup';
        }
      } catch (err) {
        error.value = err?.response?.data?.detail
          || err?.response?.data?.message
          || 'Failed to connect to server. Please try again.';
        screen.value = 'setup';
      } finally {
        clearInterval(stepTimer);
      }
    };

    const answer = (qi, letter) => {
      if (userAnswers.value[qi] !== undefined) return;
      userAnswers.value = { ...userAnswers.value, [qi]: letter };
    };

    const getOptionClass = (qi, letter) => {
      const selected = userAnswers.value[qi];
      const correct  = questions.value[qi]?.answer;
      if (selected === undefined) return '';
      if (letter === correct)   return 'option-correct';
      if (letter === selected)  return 'option-wrong';
      return 'option-disabled';
    };

    const reset = () => {
      screen.value    = 'setup';
      questions.value  = [];
      userAnswers.value = {};
      showResults.value = false;
      error.value     = '';
      loadStep.value  = 0;
    };

    onBeforeUnmount(() => clearInterval(stepTimer));

    return {
      screen, topic, numQuestions, difficulty, questions,
      userAnswers, showResults, error, loadStep,
      difficulties, examples,
      shortTopic, answeredCount, allAnswered,
      correctCount, summaryClass, summaryLabel,
      generate, answer, getOptionClass, reset,
    };
  },
};
</script>

<style scoped>
/* ── Tokens ── */
.qg-page {
  --blue:       #003580;
  --blue-mid:   #0052a3;
  --blue-light: #e8eef8;
  --orange:     #e8531e;
  --orange-dk:  #c94418;
  --ink:        #1a1f2e;
  --ink-soft:   #4a5568;
  --muted:      #718096;
  --border:     #dde3ef;
  --surface:    #f0f4fb;
  --white:      #ffffff;
  --green:      #059669;
  --green-lt:   #ecfdf5;
  --amber:      #d97706;
  --amber-lt:   #fffbeb;
  --red:        #dc2626;
  --red-lt:     #fff5f5;

  font-family: 'Inter', 'Segoe UI', sans-serif;
  min-height: 100vh;
  background: var(--surface);
  display: flex;
  flex-direction: column;
  color: var(--ink);
}

/* ── Header ── */
.qg-header {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 8px rgba(0,0,0,0.06);
}
.qg-header-inner {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.qg-brand { display: flex; align-items: center; gap: 12px; }
.qg-brand-mark { width: 36px; height: 36px; flex-shrink: 0; }
.qg-brand-name {
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: var(--blue);
}
.qg-brand-sub { font-size: 11px; color: var(--muted); margin-top: 1px; }

.qg-header-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--green);
  background: var(--green-lt);
  border: 1px solid #a7f3d0;
  padding: 5px 14px;
  border-radius: 999px;
}
.badge-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--green);
  animation: pulse 2s infinite;
}
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

/* ── Main ── */
.qg-main {
  flex: 1;
  max-width: 860px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 24px;
}

/* ── Setup Card ── */
.qg-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
}
.qg-intro { text-align: center; margin-bottom: 32px; }
.qg-intro h1 {
  font-family: 'Poppins', sans-serif;
  font-size: 1.7rem;
  font-weight: 800;
  color: var(--ink);
  margin: 0 0 10px;
}
.qg-intro p {
  font-size: 15px;
  color: var(--ink-soft);
  line-height: 1.65;
  max-width: 520px;
  margin: 0 auto;
}

.form-group { margin-bottom: 24px; }
.form-label {
  display: block;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 8px;
}
.qg-textarea {
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  color: var(--ink);
  background: var(--surface);
  resize: vertical;
  transition: all 0.2s;
  line-height: 1.6;
}
.qg-textarea:focus {
  outline: none;
  border-color: var(--blue);
  background: var(--white);
  box-shadow: 0 0 0 3px rgba(0,53,128,0.1);
}
.qg-textarea::placeholder { color: var(--muted); }
.char-count { font-size: 11.5px; color: var(--muted); text-align: right; margin-top: 5px; }

/* ── Controls ── */
.controls-row {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.control-group { display: flex; flex-direction: column; gap: 8px; }

.num-selector {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  background: var(--white);
}
.num-btn {
  width: 40px; height: 40px;
  border: none;
  background: var(--surface);
  color: var(--ink);
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
  display: flex; align-items: center; justify-content: center;
}
.num-btn:hover { background: var(--blue-light); color: var(--blue); }
.num-display {
  width: 48px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: var(--blue);
  border-left: 1.5px solid var(--border);
  border-right: 1.5px solid var(--border);
  line-height: 40px;
}

.difficulty-tabs { display: flex; gap: 0; border: 1.5px solid var(--border); border-radius: 10px; overflow: hidden; }
.diff-tab {
  padding: 10px 18px;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  background: var(--surface);
  color: var(--muted);
  transition: all 0.15s;
}
.diff-tab:not(:last-child) { border-right: 1.5px solid var(--border); }
.diff-tab.active.easy   { background: var(--green-lt); color: var(--green); }
.diff-tab.active.medium { background: var(--amber-lt); color: var(--amber); }
.diff-tab.active.hard   { background: var(--red-lt);   color: var(--red);   }

/* ── Error ── */
.qg-error {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--red-lt);
  border: 1px solid #fecaca;
  color: #b91c1c;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 13.5px;
  margin-bottom: 16px;
}

/* ── Generate button ── */
.qg-generate-btn {
  width: 100%;
  padding: 15px;
  background: var(--orange);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(232,83,30,0.35);
}
.qg-generate-btn:hover:not(:disabled) {
  background: var(--orange-dk);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(232,83,30,0.4);
}
.qg-generate-btn:disabled {
  background: #d1d5db;
  box-shadow: none;
  cursor: not-allowed;
}

/* ── Example chips ── */
.examples {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}
.examples-label { font-size: 12.5px; color: var(--muted); font-weight: 600; }
.example-chip {
  background: var(--blue-light);
  border: 1.5px solid #b8cbec;
  color: var(--blue);
  font-size: 12.5px;
  font-weight: 500;
  padding: 5px 13px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s;
}
.example-chip:hover { background: var(--blue); color: white; border-color: var(--blue); }

/* ── Loading ── */
.qg-loading {
  text-align: center;
  padding: 60px 40px;
}
.loader-ring {
  width: 60px; height: 60px;
  margin: 0 auto 24px;
  border: 5px solid var(--blue-light);
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.qg-loading h2 {
  font-family: 'Poppins', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 10px;
}
.qg-loading p { font-size: 14px; color: var(--ink-soft); margin: 0 0 28px; }
.loader-steps { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
.loader-step {
  font-size: 12.5px;
  color: var(--muted);
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 999px;
  transition: all 0.4s;
}
.loader-step.active { background: var(--blue); color: white; border-color: var(--blue); }

/* ── Quiz screen ── */
.quiz-topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}
.quiz-topbar h2 {
  font-family: 'Poppins', sans-serif;
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0 0 4px;
}
.quiz-meta { font-size: 13px; color: var(--muted); margin: 0; }
.diff-label-easy   { color: var(--green); font-weight: 600; }
.diff-label-medium { color: var(--amber); font-weight: 600; }
.diff-label-hard   { color: var(--red);   font-weight: 600; }

.quiz-topbar-actions { display: flex; gap: 10px; align-items: center; }

.btn-results {
  background: var(--blue);
  color: white;
  border: none;
  font-size: 13.5px;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-results:hover { background: var(--blue-mid); }

.btn-reset {
  background: var(--white);
  border: 2px solid var(--border);
  color: var(--ink-soft);
  font-size: 13.5px;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-reset:hover { border-color: var(--blue); color: var(--blue); }

/* ── Progress bar ── */
.progress-bar {
  height: 5px;
  background: var(--border);
  border-radius: 999px;
  margin-bottom: 24px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--blue), var(--orange));
  border-radius: 999px;
  transition: width 0.4s ease;
}

/* ── Results summary ── */
.results-summary {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 22px 28px;
  border-radius: 14px;
  margin-bottom: 24px;
  color: white;
}
.summary-green { background: linear-gradient(135deg, #065f46, #059669); }
.summary-amber { background: linear-gradient(135deg, #92400e, #d97706); }
.summary-red   { background: linear-gradient(135deg, #7f1d1d, #dc2626); }

.results-score {
  font-family: 'Poppins', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
  flex-shrink: 0;
}
.results-title { font-size: 16px; font-weight: 700; margin-bottom: 3px; }
.results-sub   { font-size: 13px; opacity: 0.85; }

/* ── Question cards ── */
.questions-list { display: flex; flex-direction: column; gap: 20px; }

.question-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  gap: 16px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.05);
  transition: border-color 0.2s;
}
.question-card.answered { border-color: #c3d4f0; }

.q-number {
  width: 36px; height: 36px;
  background: var(--blue);
  color: white;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}
.q-body { flex: 1; min-width: 0; }
.q-text {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.5;
  margin: 0 0 16px;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 0;
}
.option-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  font-size: 13.5px;
  color: var(--ink-soft);
}
.option-btn:hover:not(:disabled) {
  border-color: var(--blue);
  background: var(--blue-light);
  color: var(--blue);
}
.option-letter {
  width: 26px; height: 26px;
  border-radius: 7px;
  background: var(--border);
  color: var(--ink-soft);
  font-size: 12px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.option-btn:hover:not(:disabled) .option-letter {
  background: var(--blue);
  color: white;
}
.option-correct {
  border-color: var(--green) !important;
  background: var(--green-lt) !important;
  color: var(--green) !important;
}
.option-correct .option-letter {
  background: var(--green) !important;
  color: white !important;
}
.option-wrong {
  border-color: var(--red) !important;
  background: var(--red-lt) !important;
  color: var(--red) !important;
}
.option-wrong .option-letter {
  background: var(--red) !important;
  color: white !important;
}
.option-disabled { opacity: 0.45; cursor: not-allowed !important; }
.option-btn:disabled { cursor: not-allowed; }

/* ── Explanation ── */
.explanation {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-top: 14px;
  padding: 14px 16px;
  background: var(--surface);
  border-radius: 10px;
  border-left: 3px solid var(--blue);
  font-size: 13.5px;
  color: var(--ink-soft);
  line-height: 1.55;
}
.explanation-icon {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: var(--blue);
  color: white;
  font-size: 13px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.explanation strong { display: block; color: var(--ink); margin-bottom: 3px; font-weight: 600; }
.explanation p { margin: 0; }

.fade-enter-active { transition: all 0.3s ease; }
.fade-enter-from   { opacity: 0; transform: translateY(-6px); }

/* ── Bottom actions ── */
.quiz-bottom {
  display: flex;
  gap: 14px;
  justify-content: center;
  margin-top: 28px;
  flex-wrap: wrap;
}
.btn-results-lg {
  background: var(--blue);
  color: white;
  border: none;
  font-size: 15px;
  font-weight: 700;
  padding: 14px 28px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(0,53,128,0.3);
}
.btn-results-lg:hover { background: var(--blue-mid); transform: translateY(-1px); }
.btn-reset-lg {
  background: var(--white);
  border: 2px solid var(--border);
  color: var(--ink-soft);
  font-size: 15px;
  font-weight: 600;
  padding: 14px 28px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-reset-lg:hover { border-color: var(--orange); color: var(--orange); }

/* ── Footer ── */
.qg-footer {
  text-align: center;
  padding: 18px;
  font-size: 12px;
  color: var(--muted);
  border-top: 1px solid var(--border);
  background: var(--white);
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .qg-card { padding: 24px 18px; }
  .options-grid { grid-template-columns: 1fr; }
  .controls-row { flex-direction: column; gap: 20px; }
  .quiz-topbar { flex-direction: column; }
  .results-summary { flex-direction: column; text-align: center; }
}
</style>
