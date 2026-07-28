<template>
  <div class="admin-page">

    <!-- ===================== PIN Gate Modal ===================== -->
    <div v-if="!authenticated" class="pin-overlay">
      <div class="pin-modal">
        <div class="pin-logo">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="10" fill="#8B0000"/>
            <path d="M24 8L8 17l16 8 12-6.1V27h3V17L24 8z" fill="white"/>
            <path d="M12 20v8c0 2.5 5.4 4.5 12 4.5s12-2 12-4.5v-8l-12 6-12-6z" fill="white" opacity="0.6"/>
          </svg>
        </div>
        <h2 class="pin-title">CU Admin Dashboard</h2>
        <p class="pin-subtitle">Enter your admin PIN to continue</p>
        <form @submit.prevent="checkPin" class="pin-form">
          <div class="pin-input-wrap">
            <input
              v-model="pinInput"
              :type="pinVisible ? 'text' : 'password'"
              class="pin-input"
              placeholder="Enter PIN"
              autocomplete="off"
              ref="pinInputRef"
            />
            <button type="button" class="pin-eye" @click="pinVisible = !pinVisible" tabindex="-1">
              <svg v-if="!pinVisible" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
          <button type="submit" class="pin-btn">Enter</button>
        </form>
        <p v-if="pinError" class="pin-error">{{ pinError }}</p>
      </div>
    </div>

    <!-- ===================== Document Content Dialog ===================== -->
    <transition name="dialog-fade">
      <div v-if="docDialog.show" class="dialog-overlay" @click.self="closeDocDialog">
        <div class="dialog-box">
          <div class="dialog-header">
            <div>
              <h3 class="dialog-title">{{ docDialog.title }}</h3>
              <span class="badge" style="margin-top:4px;display:inline-block">{{ docDialog.category }}</span>
              <span class="dialog-meta">{{ docDialog.chunkCount }} chunk{{ docDialog.chunkCount !== 1 ? 's' : '' }}</span>
            </div>
            <button class="dialog-close" @click="closeDocDialog">✕</button>
          </div>
          <div class="dialog-body">
            <div v-if="docDialog.loading" class="loading-state">Loading content...</div>
            <pre v-else class="doc-content">{{ docDialog.content }}</pre>
          </div>
        </div>
      </div>
    </transition>

    <!-- ===================== Main Dashboard ===================== -->
    <template v-if="authenticated">

      <!-- Header -->
      <div class="dash-header">
        <div class="dash-header-inner">
          <div class="dash-brand">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="7" fill="white" opacity="0.15"/>
              <path d="M16 5L5 11l11 5.5 8-4.1V16h2V11L16 5z" fill="white"/>
              <path d="M8 13.5v5c0 1.5 3.6 3 8 3s8-1.5 8-3v-5l-8 4-8-4z" fill="white" opacity="0.6"/>
            </svg>
            <span>CU Knowledge Base Admin</span>
          </div>
          <button class="logout-btn" @click="logout">Logout</button>
        </div>
      </div>

      <div class="dash-body">

        <!-- Toast notification -->
        <transition name="toast-fade">
          <div v-if="toast.show" :class="['toast', toast.type]">
            {{ toast.message }}
          </div>
        </transition>

        <!-- Stats Row -->
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-label">Total Documents</div>
            <div class="stat-value">{{ status.total_documents ?? '—' }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Collection</div>
            <div class="stat-value small">{{ status.collection_name ?? '—' }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Model</div>
            <div class="stat-value small">{{ status.model_name ?? '—' }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Last Updated</div>
            <div class="stat-value small">{{ lastUpdated }}</div>
          </div>
        </div>

        <!-- Two-column layout -->
        <div class="dash-grid">

          <!-- Add Knowledge Card -->
          <div class="card">
            <div class="card-header">
              <h3>Add Knowledge</h3>
            </div>
            <div class="card-body">
              <form @submit.prevent="addDocument" class="add-form">
                <div class="form-field">
                  <label>Title</label>
                  <input
                    v-model="addForm.title"
                    type="text"
                    placeholder="Document title"
                    :disabled="adding"
                    required
                  />
                </div>
                <div class="form-field">
                  <label>Category</label>
                  <select v-model="addForm.category" :disabled="adding" required>
                    <option value="">Select a category</option>
                    <option value="admissions">Admissions</option>
                    <option value="placements">Placements</option>
                    <option value="programs">Programs</option>
                    <option value="fees">Fees</option>
                    <option value="scholarships">Scholarships</option>
                    <option value="hostel">Hostel</option>
                    <option value="campus_life">Campus Life</option>
                    <option value="research">Research</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div class="form-field">
                  <label>Content</label>
                  <textarea
                    v-model="addForm.content"
                    placeholder="Paste the document content here..."
                    rows="8"
                    :disabled="adding"
                    required
                  ></textarea>
                </div>
                <button type="submit" class="btn-primary" :disabled="adding">
                  <span v-if="adding">Adding...</span>
                  <span v-else>Add to Knowledge Base</span>
                </button>
              </form>
            </div>
          </div>

          <!-- Documents List Card -->
          <div class="card">
            <div class="card-header">
              <h3>Documents ({{ documents.length }})</h3>
              <button class="btn-outline" @click="reloadFromFiles" :disabled="reloading">
                <span v-if="reloading">Reloading...</span>
                <span v-else>Reload from Files</span>
              </button>
            </div>
            <div class="card-body">
              <div v-if="loadingDocs" class="loading-state">Loading documents...</div>
              <div v-else-if="documents.length === 0" class="empty-state">
                No documents in the knowledge base yet.
              </div>
              <div v-else class="table-wrap">
                <table class="docs-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Chunks</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="doc in documents" :key="doc.doc_id">
                      <td class="col-title">
                        <button class="title-link" @click="openDocDialog(doc)">{{ doc.title }}</button>
                      </td>
                      <td class="col-category">
                        <span class="badge">{{ doc.category || 'General' }}</span>
                      </td>
                      <td class="col-chunks">{{ doc.chunks ?? '—' }}</td>
                      <td class="col-actions">
                        <button
                          class="btn-delete"
                          @click="deleteDocument(doc.doc_id)"
                          :disabled="deletingId === doc.doc_id"
                        >
                          {{ deletingId === doc.doc_id ? '...' : 'Delete' }}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import myAxios from '../utils/my-axios.js';

const ADMIN_PIN = '2025cu';
const ADMIN_HEADER = { 'X-Admin-Pin': ADMIN_PIN };

export default {
  name: 'AdminDashboard',
  setup() {
    // ======== Auth ========
    const authenticated = ref(false);
    const pinInput = ref(ADMIN_PIN);
    const pinVisible = ref(false);
    const pinError = ref('');
    const pinInputRef = ref(null);

    const checkPin = () => {
      if (pinInput.value === ADMIN_PIN) {
        authenticated.value = true;
        pinError.value = '';
        loadAll();
      } else {
        pinError.value = 'Incorrect PIN. Please try again.';
        pinInput.value = '';
      }
    };

    const logout = () => {
      authenticated.value = false;
      pinInput.value = '';
      pinError.value = '';
    };

    // ======== Toast ========
    const toast = reactive({ show: false, message: '', type: 'success' });
    let toastTimer = null;

    const showToast = (message, type = 'success') => {
      clearTimeout(toastTimer);
      toast.message = message;
      toast.type = type;
      toast.show = true;
      toastTimer = setTimeout(() => { toast.show = false; }, 4000);
    };

    // ======== Status ========
    const status = reactive({
      total_documents: null,
      collection_name: null,
      model_name: null,
    });
    const lastUpdated = computed(() => new Date().toLocaleTimeString());

    const fetchStatus = async () => {
      try {
        const res = await myAxios.get('/admin/status', { headers: ADMIN_HEADER });
        const d = res.data;
        status.total_documents = d.total_documents ?? d.document_count ?? null;
        status.collection_name = d.collection_name ?? d.collection ?? null;
        status.model_name = d.model_name ?? d.model ?? null;
      } catch (e) {
        // silently fail — dashboard still usable
      }
    };

    // ======== Documents ========
    const documents = ref([]);
    const loadingDocs = ref(false);
    const deletingId = ref(null);

    const fetchDocuments = async () => {
      loadingDocs.value = true;
      try {
        const res = await myAxios.get('/admin/documents', { headers: ADMIN_HEADER });
        documents.value = res.data?.documents ?? res.data ?? [];
      } catch (e) {
        showToast('Failed to load documents.', 'error');
      } finally {
        loadingDocs.value = false;
      }
    };

    const deleteDocument = async (docId) => {
      if (!confirm('Delete this document from the knowledge base?')) return;
      deletingId.value = docId;
      try {
        await myAxios.delete('/admin/delete', {
          headers: ADMIN_HEADER,
          data: { doc_id: docId },
        });
        showToast('Document deleted successfully.');
        await fetchDocuments();
        await fetchStatus();
      } catch (e) {
        showToast('Failed to delete document.', 'error');
      } finally {
        deletingId.value = null;
      }
    };

    // ======== Reload from Files ========
    const reloading = ref(false);

    const reloadFromFiles = async () => {
      reloading.value = true;
      try {
        await myAxios.post('/admin/reload', {}, { headers: ADMIN_HEADER });
        showToast('Knowledge base reloaded from files.');
        await fetchDocuments();
        await fetchStatus();
      } catch (e) {
        showToast('Failed to reload from files.', 'error');
      } finally {
        reloading.value = false;
      }
    };

    // ======== Document Content Dialog ========
    const docDialog = reactive({
      show: false,
      loading: false,
      doc_id: '',
      title: '',
      category: '',
      chunkCount: 0,
      content: '',
    });

    const openDocDialog = async (doc) => {
      docDialog.show = true;
      docDialog.loading = true;
      docDialog.title = doc.title;
      docDialog.category = doc.category || 'general';
      docDialog.chunkCount = doc.chunk_count ?? doc.chunks ?? 0;
      docDialog.content = '';
      docDialog.doc_id = doc.doc_id;
      try {
        const res = await myAxios.get(`/admin/documents/${doc.doc_id}`, { headers: ADMIN_HEADER });
        docDialog.content = res.data?.content ?? '';
        docDialog.chunkCount = res.data?.chunk_count ?? docDialog.chunkCount;
      } catch (e) {
        docDialog.content = 'Failed to load document content.';
      } finally {
        docDialog.loading = false;
      }
    };

    const closeDocDialog = () => { docDialog.show = false; };

    // ======== Add Document ========
    const addForm = reactive({ title: '', category: '', content: '' });
    const adding = ref(false);

    const addDocument = async () => {
      adding.value = true;
      try {
        const res = await myAxios.post(
          '/admin/add',
          { title: addForm.title, content: addForm.content, category: addForm.category },
          { headers: ADMIN_HEADER }
        );
        const chunks = res.data?.chunks_indexed ?? res.data?.chunks ?? '';
        showToast(`Added successfully${chunks ? ' — ' + chunks + ' chunks indexed' : ''}.`);
        addForm.title = '';
        addForm.category = '';
        addForm.content = '';
        await fetchDocuments();
        await fetchStatus();
      } catch (e) {
        const msg = e?.response?.data?.detail || e?.message || 'Failed to add document.';
        showToast(msg, 'error');
      } finally {
        adding.value = false;
      }
    };

    // ======== Init ========
    const loadAll = () => {
      fetchStatus();
      fetchDocuments();
    };

    return {
      authenticated, pinInput, pinVisible, pinError, pinInputRef, checkPin, logout,
      toast,
      status, lastUpdated,
      documents, loadingDocs, deletingId, fetchDocuments, deleteDocument,
      reloading, reloadFromFiles,
      docDialog, openDocDialog, closeDocDialog,
      addForm, adding, addDocument,
    };
  },
};
</script>

<style scoped>
/* ============================================================
   Root
   ============================================================ */
.admin-page {
  --maroon:      #8B0000;
  --maroon-dark: #6B0000;
  --maroon-mid:  #A52020;
  --gold:        #C9A84C;
  --gold-dark:   #b8943a;
  --ink:         #1a1f2e;
  --ink-soft:    #4a5568;
  --border:      #e2e8f0;
  --surface:     #f7f8fc;
  --white:       #ffffff;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  min-height: 100vh;
  background: var(--surface);
  color: var(--ink);
}

/* ============================================================
   PIN Overlay
   ============================================================ */
.pin-overlay {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #3b0000 0%, #8B0000 60%, #a52020 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.pin-modal {
  background: white;
  border-radius: 16px;
  padding: 44px 40px;
  width: 360px;
  max-width: calc(100vw - 32px);
  text-align: center;
  box-shadow: 0 24px 60px rgba(0,0,0,0.3);
}
.pin-logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
}
.pin-logo svg {
  width: 64px;
  height: 64px;
}
.pin-title {
  font-family: 'Poppins', 'Inter', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--maroon);
  margin: 0 0 8px;
}
.pin-subtitle {
  font-size: 14px;
  color: var(--ink-soft);
  margin: 0 0 28px;
}
.pin-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.pin-input {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-size: 15px;
  text-align: center;
  letter-spacing: 0.2em;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.pin-input:focus {
  border-color: var(--maroon);
  box-shadow: 0 0 0 3px rgba(139,0,0,0.1);
}
.pin-btn {
  background: var(--maroon);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.pin-btn:hover {
  background: var(--maroon-dark);
}
.pin-error {
  margin-top: 12px;
  font-size: 13.5px;
  color: #c0392b;
  font-weight: 500;
}

/* ============================================================
   Dashboard Header
   ============================================================ */
.dash-header {
  background: linear-gradient(120deg, var(--maroon-dark) 0%, var(--maroon) 100%);
  border-bottom: 3px solid var(--gold);
}
.dash-header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 28px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dash-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-family: 'Poppins', 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
}
.dash-brand svg {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}
.logout-btn {
  background: rgba(255,255,255,0.15);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 6px;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.logout-btn:hover {
  background: rgba(255,255,255,0.25);
}

/* ============================================================
   Body
   ============================================================ */
.dash-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 28px 48px;
  position: relative;
}

/* ============================================================
   Toast
   ============================================================ */
.toast {
  position: fixed;
  top: 80px;
  right: 28px;
  z-index: 500;
  padding: 14px 22px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  max-width: 340px;
}
.toast.success {
  background: #1a7a4a;
  color: white;
}
.toast.error {
  background: #c0392b;
  color: white;
}
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* ============================================================
   Stats Row
   ============================================================ */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}
.stat-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 18px 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.stat-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-soft);
  margin-bottom: 8px;
}
.stat-value {
  font-family: 'Poppins', 'Inter', sans-serif;
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--maroon);
  line-height: 1;
}
.stat-value.small {
  font-size: 1rem;
  font-weight: 600;
  color: var(--ink);
}

/* ============================================================
   Main Grid
   ============================================================ */
.dash-grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 24px;
  align-items: start;
}

/* ============================================================
   Card
   ============================================================ */
.card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
}
.card-header {
  padding: 18px 22px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--surface);
}
.card-header h3 {
  font-family: 'Poppins', 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}
.card-body {
  padding: 22px;
}

/* ============================================================
   Add Form
   ============================================================ */
.add-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-field label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink-soft);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.form-field input,
.form-field select,
.form-field textarea {
  border: 1.5px solid var(--border);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  font-family: inherit;
  color: var(--ink);
  background: white;
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
}
.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
  border-color: var(--maroon);
  box-shadow: 0 0 0 3px rgba(139,0,0,0.08);
}
.form-field input:disabled,
.form-field select:disabled,
.form-field textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f9fafb;
}

/* ============================================================
   Buttons
   ============================================================ */
.btn-primary {
  background: var(--maroon);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.btn-primary:hover:not(:disabled) {
  background: var(--maroon-dark);
  transform: translateY(-1px);
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-outline {
  background: transparent;
  color: var(--maroon);
  border: 1.5px solid var(--maroon);
  border-radius: 6px;
  padding: 7px 14px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-outline:hover:not(:disabled) {
  background: var(--maroon);
  color: white;
}
.btn-outline:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-delete {
  background: transparent;
  color: #c0392b;
  border: 1.5px solid #c0392b;
  border-radius: 5px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-delete:hover:not(:disabled) {
  background: #c0392b;
  color: white;
}
.btn-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ============================================================
   Documents Table
   ============================================================ */
.loading-state,
.empty-state {
  text-align: center;
  padding: 32px 0;
  font-size: 14px;
  color: var(--ink-soft);
}
.table-wrap {
  overflow-x: auto;
}
.docs-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}
.docs-table th {
  text-align: left;
  padding: 10px 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--ink-soft);
  border-bottom: 2px solid var(--border);
  background: var(--surface);
  white-space: nowrap;
}
.docs-table td {
  padding: 11px 12px;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}
.docs-table tr:last-child td {
  border-bottom: none;
}
.docs-table tr:hover td {
  background: #fafafa;
}
.col-title {
  font-weight: 600;
  color: var(--ink);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.col-category {
  white-space: nowrap;
}
.col-chunks {
  text-align: center;
  color: var(--ink-soft);
}
.col-actions {
  white-space: nowrap;
}
.badge {
  background: rgba(139,0,0,0.08);
  color: var(--maroon);
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 600;
}

/* ============================================================
   PIN eye toggle
   ============================================================ */
.pin-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.pin-input-wrap .pin-input {
  width: 100%;
  padding-right: 44px;
  box-sizing: border-box;
}
.pin-eye {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--ink-soft);
  display: flex;
  align-items: center;
  height: 20px;
  width: 20px;
}
.pin-eye svg {
  width: 18px;
  height: 18px;
}
.pin-eye:hover { color: var(--maroon); }

/* ============================================================
   Clickable title
   ============================================================ */
.title-link {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  font-weight: 600;
  color: var(--maroon);
  cursor: pointer;
  text-align: left;
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: text-decoration-color 0.15s;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}
.title-link:hover { text-decoration-color: var(--maroon); }

/* ============================================================
   Document content dialog
   ============================================================ */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 900;
  padding: 24px;
}
.dialog-box {
  background: white;
  border-radius: 14px;
  width: 100%;
  max-width: 680px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 60px rgba(0,0,0,0.25);
  overflow: hidden;
}
.dialog-header {
  padding: 18px 22px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
  background: var(--surface);
}
.dialog-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 4px;
}
.dialog-meta {
  font-size: 12px;
  color: var(--ink-soft);
  margin-left: 8px;
}
.dialog-close {
  background: none;
  border: none;
  font-size: 18px;
  color: var(--ink-soft);
  cursor: pointer;
  line-height: 1;
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}
.dialog-close:hover { background: var(--border); color: var(--ink); }
.dialog-body {
  padding: 20px 22px;
  overflow-y: auto;
  flex: 1;
}
.doc-content {
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: var(--ink);
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}
.dialog-fade-enter-active,
.dialog-fade-leave-active { transition: opacity 0.2s ease; }
.dialog-fade-enter-from,
.dialog-fade-leave-to { opacity: 0; }

/* ============================================================
   Responsive
   ============================================================ */
@media (max-width: 1024px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .dash-grid { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .dash-body { padding: 20px 16px 40px; }
  .stats-row { grid-template-columns: 1fr 1fr; }
  .dash-header-inner { padding: 0 16px; }
}
</style>
