<template>
  <div class="ra-page">

    <!-- ── Header ── -->
    <header class="ra-header">
      <div class="ra-header-inner">
        <div class="ra-brand">
          <div class="ra-brand-mark">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="9" fill="#003580"/>
              <path d="M10 10h10l6 6v10H10V10z" fill="white" opacity="0.9"/>
              <path d="M20 10v6h6" fill="none" stroke="white" stroke-width="1.5" opacity="0.7"/>
              <line x1="13" y1="18" x2="23" y2="18" stroke="#e8531e" stroke-width="1.5" stroke-linecap="round"/>
              <line x1="13" y1="21" x2="23" y2="21" stroke="#e8531e" stroke-width="1.5" stroke-linecap="round"/>
              <line x1="13" y1="24" x2="19" y2="24" stroke="#e8531e" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div>
            <div class="ra-brand-name">AI Resume Analyzer</div>
            <div class="ra-brand-sub">Powered by GPT · Free to use</div>
          </div>
        </div>
        <div class="ra-header-badge">
          <span class="badge-dot"></span>
          Instant AI Feedback
        </div>
      </div>
    </header>

    <!-- ── Main ── -->
    <main class="ra-main">

      <!-- Upload card -->
      <div v-if="!analyzing && !result" class="ra-card">
        <div class="ra-card-intro">
          <h1>Get Your Resume Reviewed by AI</h1>
          <p>Upload your resume and receive an ATS score, strengths, areas to improve, and actionable suggestions — in seconds.</p>
        </div>

        <div
          class="ra-dropzone"
          :class="{ 'drag-over': dragging, 'has-file': selectedFile }"
          @click="triggerInput"
          @drop.prevent="onDrop"
          @dragover.prevent="dragging = true"
          @dragleave.prevent="dragging = false"
        >
          <input ref="fileInput" type="file" accept=".pdf,.doc,.docx" class="ra-file-input" @change="onFileChange" />

          <div v-if="!selectedFile" class="dropzone-idle">
            <div class="dropzone-icon">
              <svg viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="#e8eef8"/>
                <path d="M24 32V20M18 26l6-6 6 6" stroke="#003580" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 34h16" stroke="#003580" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
              </svg>
            </div>
            <p class="dropzone-label"><strong>Click to upload</strong> or drag &amp; drop</p>
            <p class="dropzone-hint">PDF, DOC or DOCX &nbsp;·&nbsp; Max 5 MB</p>
          </div>

          <div v-else class="dropzone-selected">
            <div class="file-icon">
              <svg viewBox="0 0 36 36" fill="none">
                <rect width="36" height="36" rx="8" fill="#e8eef8"/>
                <path d="M10 8h12l8 8v14H10V8z" fill="#003580" opacity="0.15"/>
                <path d="M22 8v8h8" fill="none" stroke="#003580" stroke-width="1.5"/>
                <line x1="13" y1="20" x2="23" y2="20" stroke="#e8531e" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="13" y1="23" x2="23" y2="23" stroke="#e8531e" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="file-details">
              <span class="file-name">{{ selectedFile.name }}</span>
              <span class="file-size">{{ formatSize(selectedFile.size) }}</span>
            </div>
            <button class="file-remove" @click.stop="clearFile" aria-label="Remove">✕</button>
          </div>
        </div>

        <div v-if="error" class="ra-error">
          <span>⚠</span> {{ error }}
        </div>

        <button class="ra-analyze-btn" :disabled="!selectedFile" @click="analyze">
          <span v-if="!selectedFile">Select a file to continue</span>
          <span v-else>Analyze Resume →</span>
        </button>

        <!-- How it works -->
        <div class="ra-steps">
          <div class="ra-step">
            <div class="step-num">1</div>
            <span>Upload your resume (PDF or DOCX)</span>
          </div>
          <div class="ra-step-arrow">→</div>
          <div class="ra-step">
            <div class="step-num">2</div>
            <span>AI reads and scores your resume</span>
          </div>
          <div class="ra-step-arrow">→</div>
          <div class="ra-step">
            <div class="step-num">3</div>
            <span>Get actionable feedback instantly</span>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="analyzing" class="ra-card ra-loading">
        <div class="loader-ring"></div>
        <h2>Analyzing your resume…</h2>
        <p>Our AI is reviewing your resume for ATS compatibility, skills, and improvements.</p>
        <div class="loader-steps">
          <div class="loader-step" :class="{ active: loadStep >= 1 }">Extracting content</div>
          <div class="loader-step" :class="{ active: loadStep >= 2 }">Running AI analysis</div>
          <div class="loader-step" :class="{ active: loadStep >= 3 }">Generating feedback</div>
        </div>
      </div>

      <!-- Results -->
      <div v-if="result && !analyzing" class="ra-results">

        <!-- Top bar -->
        <div class="results-topbar">
          <div>
            <h2>Analysis Complete</h2>
            <p class="results-file">{{ meta.filename }} &nbsp;·&nbsp; {{ formatSize(meta.file_size) }} &nbsp;·&nbsp; {{ Math.round(meta.execution_time_ms / 1000) }}s</p>
          </div>
          <button class="btn-reset" @click="reset">Analyze Another →</button>
        </div>

        <!-- Score card -->
        <div class="score-card" :class="scoreClass">
          <div class="score-left">
            <div class="score-label">ATS Compatibility Score</div>
            <div class="score-value">{{ result.ats_score }}<span>/100</span></div>
            <div class="score-desc">{{ scoreLabel }}</div>
          </div>
          <div class="score-ring-wrap">
            <svg class="score-ring" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="8"/>
              <circle
                cx="40" cy="40" r="34" fill="none"
                stroke="white" stroke-width="8"
                stroke-linecap="round"
                :stroke-dasharray="`${result.ats_score * 2.136} 213.6`"
                transform="rotate(-90 40 40)"
              />
            </svg>
            <div class="score-ring-num">{{ result.ats_score }}</div>
          </div>
        </div>

        <!-- Feedback grid -->
        <div class="feedback-grid">

          <div class="feedback-card strengths">
            <div class="feedback-header">
              <span class="feedback-icon">✓</span>
              <h3>Strengths</h3>
            </div>
            <ul>
              <li v-for="(s, i) in result.strengths" :key="i">{{ s }}</li>
            </ul>
          </div>

          <div class="feedback-card weaknesses">
            <div class="feedback-header">
              <span class="feedback-icon">⚠</span>
              <h3>Areas to Improve</h3>
            </div>
            <ul>
              <li v-for="(w, i) in result.weaknesses" :key="i">{{ w }}</li>
            </ul>
          </div>

          <div class="feedback-card suggestions">
            <div class="feedback-header">
              <span class="feedback-icon">→</span>
              <h3>Recommendations</h3>
            </div>
            <ul>
              <li v-for="(s, i) in result.suggestions" :key="i">{{ s }}</li>
            </ul>
          </div>

          <div class="feedback-card summary">
            <div class="feedback-header">
              <span class="feedback-icon">📝</span>
              <h3>Overall Summary</h3>
            </div>
            <p>{{ result.summary }}</p>
          </div>

        </div>

        <!-- Keywords -->
        <div v-if="result.keywords && result.keywords.length" class="keywords-section">
          <h3>Skills &amp; Keywords Detected</h3>
          <div class="keywords-list">
            <span v-for="(k, i) in result.keywords" :key="i" class="keyword-chip">{{ k }}</span>
          </div>
        </div>

        <div v-if="error" class="ra-error" style="margin-top:16px">
          <span>⚠</span> {{ error }}
        </div>

      </div>
    </main>

    <!-- ── Footer ── -->
    <footer class="ra-footer">
      AI Resume Analyzer &nbsp;·&nbsp; Powered by OpenAI GPT &nbsp;·&nbsp; For educational demo purposes
    </footer>
  </div>
</template>

<script>
import { ref, computed, onBeforeUnmount } from 'vue';
import myAxios from '../utils/my-axios.js';

export default {
  name: 'ResumeAnalyzer',
  setup() {
    const fileInput  = ref(null);
    const selectedFile = ref(null);
    const dragging   = ref(false);
    const analyzing  = ref(false);
    const result     = ref(null);
    const meta       = ref({});
    const error      = ref('');
    const loadStep   = ref(0);

    let stepTimer = null;

    const scoreClass = computed(() => {
      if (!result.value) return '';
      const s = result.value.ats_score;
      if (s >= 75) return 'score-green';
      if (s >= 50) return 'score-amber';
      return 'score-red';
    });

    const scoreLabel = computed(() => {
      if (!result.value) return '';
      const s = result.value.ats_score;
      if (s >= 75) return 'Strong ATS compatibility';
      if (s >= 50) return 'Moderate — room to improve';
      return 'Needs significant work';
    });

    const triggerInput = () => fileInput.value?.click();

    const validateFile = (file) => {
      error.value = '';
      const ok = ['application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!ok.includes(file.type)) {
        error.value = 'Please upload a PDF, DOC, or DOCX file.';
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        error.value = 'File must be under 5 MB.';
        return false;
      }
      return true;
    };

    const onFileChange = (e) => {
      const f = e.target.files[0];
      if (f && validateFile(f)) selectedFile.value = f;
    };

    const onDrop = (e) => {
      dragging.value = false;
      const f = e.dataTransfer.files[0];
      if (f && validateFile(f)) selectedFile.value = f;
    };

    const clearFile = () => {
      selectedFile.value = null;
      error.value = '';
      if (fileInput.value) fileInput.value.value = '';
    };

    const formatSize = (bytes) => {
      if (!bytes) return '';
      return bytes >= 1024 * 1024
        ? (bytes / (1024 * 1024)).toFixed(1) + ' MB'
        : Math.round(bytes / 1024) + ' KB';
    };

    const startLoadSteps = () => {
      loadStep.value = 1;
      stepTimer = setInterval(() => {
        if (loadStep.value < 3) loadStep.value++;
        else clearInterval(stepTimer);
      }, 1800);
    };

    const analyze = async () => {
      if (!selectedFile.value) return;
      analyzing.value = true;
      error.value = '';
      result.value = null;
      startLoadSteps();

      try {
        const form = new FormData();
        form.append('file', selectedFile.value);
        const res = await myAxios.post('/resume/analyze', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (res.data.success) {
          result.value = res.data.analysis;
          meta.value   = res.data.metadata || {};
        } else {
          error.value = res.data.message || 'Analysis failed. Please try again.';
        }
      } catch (err) {
        error.value = err?.response?.data?.detail
          || err?.response?.data?.message
          || 'Failed to connect to the server. Please try again.';
      } finally {
        clearInterval(stepTimer);
        analyzing.value = false;
      }
    };

    const reset = () => {
      selectedFile.value = null;
      result.value = null;
      meta.value   = {};
      error.value  = '';
      loadStep.value = 0;
      if (fileInput.value) fileInput.value.value = '';
    };

    onBeforeUnmount(() => clearInterval(stepTimer));

    return {
      fileInput, selectedFile, dragging, analyzing,
      result, meta, error, loadStep,
      scoreClass, scoreLabel,
      triggerInput, onFileChange, onDrop, clearFile,
      formatSize, analyze, reset,
    };
  },
};
</script>

<style scoped>
/* ── Tokens ── */
.ra-page {
  --blue:        #003580;
  --blue-mid:    #0052a3;
  --blue-light:  #e8eef8;
  --orange:      #e8531e;
  --orange-dk:   #c94418;
  --ink:         #1a1f2e;
  --ink-soft:    #4a5568;
  --muted:       #718096;
  --border:      #dde3ef;
  --surface:     #f0f4fb;
  --white:       #ffffff;
  --green:       #059669;
  --amber:       #d97706;
  --red:         #dc2626;

  font-family: 'Inter', 'Segoe UI', sans-serif;
  min-height: 100vh;
  background: var(--surface);
  display: flex;
  flex-direction: column;
  color: var(--ink);
}

/* ── Header ── */
.ra-header {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 8px rgba(0,0,0,0.06);
}
.ra-header-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ra-brand { display: flex; align-items: center; gap: 12px; }
.ra-brand-mark { width: 36px; height: 36px; flex-shrink: 0; }
.ra-brand-name {
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: var(--blue);
}
.ra-brand-sub { font-size: 11px; color: var(--muted); margin-top: 1px; }
.ra-header-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--green);
  background: #ecfdf5;
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
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
}

/* ── Main ── */
.ra-main {
  flex: 1;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 24px;
}

/* ── Upload Card ── */
.ra-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
}
.ra-card-intro { text-align: center; margin-bottom: 32px; }
.ra-card-intro h1 {
  font-family: 'Poppins', sans-serif;
  font-size: 1.7rem;
  font-weight: 800;
  color: var(--ink);
  margin: 0 0 10px;
}
.ra-card-intro p {
  font-size: 15px;
  color: var(--ink-soft);
  line-height: 1.65;
  max-width: 520px;
  margin: 0 auto;
}

/* ── Dropzone ── */
.ra-dropzone {
  border: 2.5px dashed var(--border);
  border-radius: 16px;
  background: var(--surface);
  padding: 44px 28px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  margin-bottom: 20px;
}
.ra-dropzone:hover,
.ra-dropzone.drag-over {
  border-color: var(--blue);
  background: var(--blue-light);
}
.ra-dropzone.has-file {
  border-style: solid;
  border-color: var(--blue);
  background: var(--blue-light);
  padding: 22px 28px;
}
.ra-file-input { display: none; }

.dropzone-icon { margin-bottom: 16px; }
.dropzone-icon svg { width: 56px; height: 56px; }
.dropzone-label { font-size: 15px; color: var(--ink); margin: 0 0 6px; }
.dropzone-hint  { font-size: 13px; color: var(--muted); margin: 0; }

.dropzone-selected {
  display: flex;
  align-items: center;
  gap: 14px;
  justify-content: center;
}
.file-icon svg { width: 40px; height: 40px; }
.file-details { display: flex; flex-direction: column; gap: 2px; text-align: left; }
.file-name { font-size: 14px; font-weight: 600; color: var(--blue); }
.file-size { font-size: 12px; color: var(--muted); }
.file-remove {
  background: #fee2e2;
  color: var(--red);
  border: none;
  width: 28px; height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 13px;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
  flex-shrink: 0;
}
.file-remove:hover { background: #fecaca; }

/* ── Error ── */
.ra-error {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff5f5;
  border: 1px solid #fecaca;
  color: #b91c1c;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 13.5px;
  margin-bottom: 16px;
}

/* ── Analyze button ── */
.ra-analyze-btn {
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
  margin-bottom: 32px;
  box-shadow: 0 4px 16px rgba(232,83,30,0.35);
}
.ra-analyze-btn:hover:not(:disabled) {
  background: var(--orange-dk);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(232,83,30,0.4);
}
.ra-analyze-btn:disabled {
  background: #d1d5db;
  box-shadow: none;
  cursor: not-allowed;
}

/* ── How it works steps ── */
.ra-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1px solid var(--border);
}
.ra-step {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--ink-soft);
}
.step-num {
  width: 26px; height: 26px;
  border-radius: 50%;
  background: var(--blue);
  color: white;
  font-size: 12px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ra-step-arrow { color: var(--muted); font-size: 16px; }

/* ── Loading ── */
.ra-loading {
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
.ra-loading h2 {
  font-family: 'Poppins', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 10px;
  color: var(--ink);
}
.ra-loading p {
  font-size: 14px;
  color: var(--ink-soft);
  margin: 0 0 28px;
}
.loader-steps {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}
.loader-step {
  font-size: 12.5px;
  color: var(--muted);
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 999px;
  transition: all 0.4s;
}
.loader-step.active {
  background: var(--blue);
  color: white;
  border-color: var(--blue);
}

/* ── Results ── */
.ra-results {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.results-topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
}
.results-topbar h2 {
  font-family: 'Poppins', sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0 0 4px;
  color: var(--ink);
}
.results-file { font-size: 12.5px; color: var(--muted); margin: 0; }
.btn-reset {
  background: var(--white);
  border: 2px solid var(--blue);
  color: var(--blue);
  font-size: 13.5px;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-reset:hover { background: var(--blue); color: white; }

/* ── Score card ── */
.score-card {
  border-radius: 18px;
  padding: 32px 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  color: white;
  flex-wrap: wrap;
}
.score-green { background: linear-gradient(135deg, #065f46, #059669); }
.score-amber { background: linear-gradient(135deg, #92400e, #d97706); }
.score-red   { background: linear-gradient(135deg, #7f1d1d, #dc2626); }

.score-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.85;
  margin-bottom: 8px;
}
.score-value {
  font-family: 'Poppins', sans-serif;
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 8px;
}
.score-value span { font-size: 1.4rem; opacity: 0.7; }
.score-desc { font-size: 14px; opacity: 0.9; }

.score-ring-wrap { position: relative; width: 80px; height: 80px; flex-shrink: 0; }
.score-ring { width: 80px; height: 80px; }
.score-ring-num {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  color: white;
}

/* ── Feedback grid ── */
.feedback-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.feedback-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.05);
}
.feedback-card.summary { grid-column: 1 / -1; }

.feedback-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.feedback-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px;
  flex-shrink: 0;
}
.strengths   .feedback-icon { background: #ecfdf5; }
.weaknesses  .feedback-icon { background: #fffbeb; }
.suggestions .feedback-icon { background: var(--blue-light); }
.summary     .feedback-icon { background: #f5f3ff; }

.feedback-header h3 {
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}
.feedback-card ul {
  margin: 0; padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.feedback-card ul li {
  font-size: 13.5px;
  color: var(--ink-soft);
  line-height: 1.55;
  padding-left: 16px;
  position: relative;
}
.strengths   ul li::before { content:'✓'; position:absolute; left:0; color:var(--green); font-weight:700; }
.weaknesses  ul li::before { content:'⚠'; position:absolute; left:0; color:var(--amber); }
.suggestions ul li::before { content:'→'; position:absolute; left:0; color:var(--blue); font-weight:700; }

.feedback-card p {
  font-size: 14px;
  color: var(--ink-soft);
  line-height: 1.7;
  margin: 0;
}

/* ── Keywords ── */
.keywords-section {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.05);
}
.keywords-section h3 {
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 14px;
}
.keywords-list { display: flex; flex-wrap: wrap; gap: 8px; }
.keyword-chip {
  background: var(--blue-light);
  border: 1.5px solid #b8cbec;
  color: var(--blue);
  font-size: 13px;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 999px;
}

/* ── Footer ── */
.ra-footer {
  text-align: center;
  padding: 18px;
  font-size: 12px;
  color: var(--muted);
  border-top: 1px solid var(--border);
  background: var(--white);
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .ra-card { padding: 24px 18px; }
  .feedback-grid { grid-template-columns: 1fr; }
  .feedback-card.summary { grid-column: 1; }
  .score-card { padding: 24px 20px; }
  .ra-steps { gap: 8px; }
  .ra-step-arrow { display: none; }
  .results-topbar { flex-direction: column; }
}
</style>
