<template>
  <div class="resume-analyzer-container">
    <div class="analyzer-card">
      <!-- Header -->
      <div class="card-header">
        <div class="header-icon">
          <img src="../images/logo.png" alt="SVIET Logo" class="sviet-logo" />
        </div>
        <div class="header-content">
          <h1 class="header-title">SVIET Resume Analyzer</h1>
          <p class="header-subtitle">AI-powered career guidance for SVIET students</p>
        </div>
      </div>

      <!-- Upload Section -->
      <div v-if="!analyzing && !analysisResult" class="upload-section">
        <div class="upload-area" @click="triggerFileInput" @drop.prevent="handleDrop" @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave" :class="{ 'drag-over': isDragging }">
          <input ref="fileInput" type="file" accept=".pdf,.doc,.docx" @change="handleFileSelect" class="file-input" />

          <div class="upload-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p class="upload-text">
            <strong>Click to upload</strong> or drag and drop
          </p>
          <p class="upload-hint">PDF, DOC, or DOCX (Max 5MB)</p>

          <div v-if="selectedFile" class="selected-file">
            <span class="file-name">{{ selectedFile.name }}</span>
            <button @click.stop="clearFile" class="clear-btn">✕</button>
          </div>
        </div>

        <button v-if="selectedFile" @click="analyzeResume" class="analyze-btn" :disabled="analyzing">
          Analyze Resume
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="analyzing" class="analyzing-section">
        <div class="spinner"></div>
        <p class="analyzing-text">Analyzing your resume...</p>
        <p class="analyzing-subtext">This may take a few moments</p>
      </div>

      <!-- Results Section -->
      <div v-if="analysisResult && !analyzing" class="results-section">
        <div class="results-header">
          <h2 class="results-title">Analysis Results</h2>
          <button @click="resetAnalyzer" class="new-analysis-btn">Analyze New Resume</button>
        </div>

        <!-- ATS Score -->
        <div v-if="analysisResult.ats_score !== undefined" class="score-card">
          <div class="score-label">ATS Compatibility Score</div>
          <div class="score-value">
            <span class="score-number">{{ analysisResult.ats_score }}</span>
            <span class="score-total">/100</span>
          </div>
          <div class="score-bar">
            <div class="score-fill" :style="{ width: analysisResult.ats_score + '%', backgroundColor: getScoreColor(analysisResult.ats_score) }"></div>
          </div>
        </div>

        <!-- Strengths -->
        <div v-if="analysisResult.strengths && analysisResult.strengths.length > 0" class="analysis-section">
          <h3 class="section-title">
            <span class="section-icon">✓</span>
            Strengths
          </h3>
          <ul class="analysis-list strengths-list">
            <li v-for="(strength, index) in analysisResult.strengths" :key="index">{{ strength }}</li>
          </ul>
        </div>

        <!-- Weaknesses -->
        <div v-if="analysisResult.weaknesses && analysisResult.weaknesses.length > 0" class="analysis-section">
          <h3 class="section-title">
            <span class="section-icon">⚠</span>
            Areas for Improvement
          </h3>
          <ul class="analysis-list weaknesses-list">
            <li v-for="(weakness, index) in analysisResult.weaknesses" :key="index">{{ weakness }}</li>
          </ul>
        </div>

        <!-- Suggestions -->
        <div v-if="analysisResult.suggestions && analysisResult.suggestions.length > 0" class="analysis-section">
          <h3 class="section-title">
            <span class="section-icon">💡</span>
            Recommendations
          </h3>
          <ul class="analysis-list suggestions-list">
            <li v-for="(suggestion, index) in analysisResult.suggestions" :key="index">{{ suggestion }}</li>
          </ul>
        </div>

        <!-- Summary -->
        <div v-if="analysisResult.summary" class="analysis-section summary-section">
          <h3 class="section-title">
            <span class="section-icon">📝</span>
            Overall Summary
          </h3>
          <p class="summary-text">{{ analysisResult.summary }}</p>
        </div>

        <!-- Keywords -->
        <div v-if="analysisResult.keywords && analysisResult.keywords.length > 0" class="analysis-section">
          <h3 class="section-title">
            <span class="section-icon">🏷️</span>
            Key Skills & Keywords
          </h3>
          <div class="keywords-container">
            <span v-for="(keyword, index) in analysisResult.keywords" :key="index" class="keyword-tag">{{ keyword }}</span>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="error-message">
        <span class="error-icon">⚠️</span>
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import myAxios from '../utils/my-axios.js';

export default {
  name: 'ResumeAnalyzer',
  setup() {
    const selectedFile = ref(null);
    const analyzing = ref(false);
    const analysisResult = ref(null);
    const error = ref('');
    const isDragging = ref(false);
    const fileInput = ref(null);

    const triggerFileInput = () => {
      fileInput.value.click();
    };

    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file) {
        validateAndSetFile(file);
      }
    };

    const handleDrop = (event) => {
      isDragging.value = false;
      const file = event.dataTransfer.files[0];
      if (file) {
        validateAndSetFile(file);
      }
    };

    const handleDragOver = () => {
      isDragging.value = true;
    };

    const handleDragLeave = () => {
      isDragging.value = false;
    };

    const validateAndSetFile = (file) => {
      error.value = '';

      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        error.value = 'Please upload a PDF, DOC, or DOCX file';
        return;
      }

      if (file.size > maxSize) {
        error.value = 'File size must be less than 5MB';
        return;
      }

      selectedFile.value = file;
    };

    const clearFile = () => {
      selectedFile.value = null;
      error.value = '';
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };

    const analyzeResume = async () => {
      if (!selectedFile.value) return;

      analyzing.value = true;
      error.value = '';
      analysisResult.value = null;

      try {
        const formData = new FormData();
        formData.append('file', selectedFile.value);

        const response = await myAxios.post('/resume/analyze', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          analysisResult.value = response.data.analysis;
        } else {
          error.value = response.data.message || 'Analysis failed. Please try again.';
        }
      } catch (err) {
        console.error('Error analyzing resume:', err);
        error.value = err?.response?.data?.detail || err?.response?.data?.message || 'Failed to analyze resume. Please try again.';
      } finally {
        analyzing.value = false;
      }
    };

    const resetAnalyzer = () => {
      selectedFile.value = null;
      analysisResult.value = null;
      error.value = '';
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };

    const getScoreColor = (score) => {
      if (score >= 80) return '#10b981';
      if (score >= 60) return '#f59e0b';
      return '#ef4444';
    };

    return {
      selectedFile,
      analyzing,
      analysisResult,
      error,
      isDragging,
      fileInput,
      triggerFileInput,
      handleFileSelect,
      handleDrop,
      handleDragOver,
      handleDragLeave,
      clearFile,
      analyzeResume,
      resetAnalyzer,
      getScoreColor,
    };
  },
};
</script>

<style scoped>
.resume-analyzer-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.analyzer-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  max-width: 800px;
  width: 100%;
  overflow: hidden;
}

.card-header {
  background: #003D82;
  color: white;
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sviet-logo {
  width: 60px;
  height: auto;
  object-fit: contain;
}

.header-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
}

.header-subtitle {
  margin: 8px 0 0;
  font-size: 14px;
  opacity: 0.9;
  font-weight: 400;
}

.upload-section {
  padding: 40px;
}

.upload-area {
  border: 3px dashed #d1d5db;
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #E8731E;
  background: #f3f4f6;
}

.file-input {
  display: none;
}

.upload-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  color: #003D82;
}

.upload-icon svg {
  width: 100%;
  height: 100%;
}

.upload-text {
  font-size: 16px;
  color: #374151;
  margin: 0 0 8px;
}

.upload-hint {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.selected-file {
  margin-top: 20px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 12px 20px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.file-name {
  font-weight: 500;
  color: #003D82;
}

.clear-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #dc2626;
}

.analyze-btn {
  width: 100%;
  margin-top: 24px;
  padding: 16px;
  background: #003D82;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.analyze-btn:hover:not(:disabled) {
  background: #0052A3;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 61, 130, 0.4);
}

.analyze-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.analyzing-section {
  padding: 80px 40px;
  text-align: center;
}

.spinner {
  width: 60px;
  height: 60px;
  margin: 0 auto 24px;
  border: 4px solid #f3f4f6;
  border-top-color: #003D82;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.analyzing-text {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px;
}

.analyzing-subtext {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.results-section {
  padding: 40px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.results-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.new-analysis-btn {
  padding: 10px 20px;
  background: white;
  border: 2px solid #003D82;
  color: #003D82;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.new-analysis-btn:hover {
  background: #003D82;
  color: white;
}

.score-card {
  background: linear-gradient(135deg, #003D82 0%, #0052A3 100%);
  color: white;
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 30px;
}

.score-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.score-value {
  font-size: 56px;
  font-weight: 700;
  margin-bottom: 20px;
}

.score-total {
  font-size: 28px;
  opacity: 0.8;
}

.score-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  transition: width 0.6s ease;
  border-radius: 4px;
}

.analysis-section {
  margin-bottom: 30px;
  padding: 24px;
  background: #f9fafb;
  border-radius: 12px;
  border-left: 4px solid #E8731E;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  font-size: 20px;
}

.analysis-list {
  margin: 0;
  padding-left: 24px;
  list-style: none;
}

.analysis-list li {
  position: relative;
  padding-left: 24px;
  margin-bottom: 12px;
  line-height: 1.6;
  color: #374151;
}

.analysis-list li:before {
  content: '•';
  position: absolute;
  left: 0;
  font-weight: bold;
  color: #003D82;
}

.strengths-list li:before {
  content: '✓';
  color: #10b981;
}

.weaknesses-list li:before {
  content: '⚠';
  color: #f59e0b;
}

.suggestions-list li:before {
  content: '→';
  color: #003D82;
}

.summary-section {
  border-left-color: #003D82;
}

.summary-text {
  margin: 0;
  line-height: 1.7;
  color: #374151;
}

.keywords-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.keyword-tag {
  background: white;
  border: 2px solid #E8731E;
  color: #003D82;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.error-message {
  margin: 20px 40px;
  padding: 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #991b1b;
  display: flex;
  align-items: center;
  gap: 12px;
}

.error-icon {
  font-size: 20px;
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    text-align: center;
  }

  .header-title {
    font-size: 24px;
  }

  .upload-section,
  .results-section {
    padding: 24px;
  }

  .upload-area {
    padding: 40px 20px;
  }

  .results-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .score-value {
    font-size: 48px;
  }
}
</style>
