import axios from 'axios';

/**
 * Axios instance configured for RAG Chat API
 *
 * Update baseURL to point to your backend server:
 * - Development: http://localhost:8000/api/v1
 * - Production: https://your-domain.com/api/v1
 */
const myAxios = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // RAG Chat API base URL
  timeout: 60000, // 60 seconds timeout for LLM responses
});

export default myAxios;
