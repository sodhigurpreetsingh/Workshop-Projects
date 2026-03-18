# RAG Chat Frontend

A modern Vue.js 3 frontend application for the RAG (Retrieval Augmented Generation) Chat System. This application allows users to ask questions about uploaded documents and receive AI-generated answers with source citations.

---

## 🚀 Features

- 💬 **Real-time Chat Interface** - Clean, modern chat UI
- 🔍 **Document-based Q&A** - Ask questions about your uploaded documents
- 📚 **Source Citations** - See which documents were used to generate answers
- ⚡ **Fast & Responsive** - Built with Vue 3 and Vite
- 🎨 **Modern Design** - Clean, intuitive user interface
- 📱 **Responsive Layout** - Works on desktop and mobile devices
- 🔌 **Floating Widget** - Embeddable chat button for any website

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js 16+** installed ([Download Node.js](https://nodejs.org/))
- **npm** or **yarn** package manager (comes with Node.js)
- **Backend API** running on `http://127.0.0.1:8000` ([Backend Setup](../backend/README.md))

---

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd chatbot
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

---

## 🎯 Usage

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at:
- **Local:** http://localhost:5173
- **Network:** http://192.168.x.x:5173 (for testing on other devices)

You should see output like:
```
VITE v5.0.0  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.100:5173/
➜  press h + enter to show help
```

### Production Build

Build for production:

```bash
npm run build
```

Build as custom element (for embedding):

```bash
npm run build:ce
```

Preview the production build:

```bash
npm run preview
```

---

## 📁 Project Structure

```
chatbot/
├── public/               # Static assets
├── src/
│   ├── components/       # Vue components
│   │   └── Chatbot.vue   # Main chat component
│   ├── utils/
│   │   └── my-axios.js   # API configuration
│   ├── App.vue          # Root component
│   ├── main.js          # Application entry point
│   ├── element.js       # Custom element builder
│   └── style.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Standard build config
├── vite.ce.config.js    # Custom element build config
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

## 🔌 API Configuration

The frontend connects to the backend API at `http://127.0.0.1:8000/api/v1`

To change the API endpoint, edit `src/utils/my-axios.js`:

```javascript
const myAxios = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',  // Change to your API URL
  timeout: 60000,
});
```

---

## 🎨 How to Use the Chat Interface

1. **Start the Backend API**
   - Make sure the backend is running on port 8000
   - Add some `.txt` documents to the backend's `documents/txts/` folder

2. **Start the Frontend**
   - Run `npm run dev`
   - Open http://localhost:5173

3. **Ask Questions**
   - Click the floating chat button (bottom right)
   - Type your question in the input box
   - Press Enter or click the Send button
   - The AI will search your documents and provide an answer

4. **View Sources**
   - Each answer includes source citations
   - See which documents were used to generate the answer
   - Review relevant excerpts from the source documents

---

## 🧪 Testing

### Manual Testing

1. Start both backend and frontend
2. Click the chat button to open the interface
3. Ask a simple question: "What is this about?"
4. Verify you receive a response with sources
5. Try different types of questions:
   - Factual: "What are the key features?"
   - Analytical: "How does this work?"
   - Specific: "What is mentioned about X?"

### Test Without Backend

If the backend is not running, the app will show connection errors. Make sure:
- Backend is running on `http://127.0.0.1:8000`
- CORS is enabled in the backend
- Documents are loaded in the backend

---

## 🔧 Configuration

### API Configuration

Edit `src/utils/my-axios.js` to customize the API endpoint:

```javascript
const myAxios = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  timeout: 60000,
});
```

### Vite Configuration

Edit `vite.config.js` to customize:

```javascript
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,        // Change frontend port
    host: true,        // Expose to network
    proxy: {
      '/api': {        // Proxy API requests
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      }
    }
  }
})
```

### Environment Variables

Create a `.env` file for environment-specific settings:

```env
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

Then use in `my-axios.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## 🎨 Customization

### Styling

Global styles are in `src/style.css`. Component-specific styles are in each `.vue` file.

To customize colors, edit `src/components/Chatbot.vue`:

```css
/* Floating button */
.floating-button {
  background: #1a1a1a;  /* Change to your brand color */
}

/* Header */
.chat-header {
  background: #1a1a1a;  /* Change to your brand color */
}

/* User messages */
.message.user .message-bubble {
  background: #1a1a1a;  /* Change to your brand color */
}
```

### Text & Branding

Edit the header and welcome message in `src/components/Chatbot.vue`:

```vue
<!-- Header -->
<div class="header-title">RAG Chat Assistant</div>
<div class="header-subtitle">Ask questions about documents</div>

<!-- Welcome message (in setup function) -->
messages: ref([{
  role: 'assistant',
  content: 'Hello! I can answer questions about the documents in our knowledge base.',
  timestamp: new Date(),
}]),
```

---

## 📡 API Integration

### Endpoints Used

#### POST /api/v1/chat/ask
Ask a question and get an answer from the RAG system.

**Request:**
```json
{
  "question": "What products does the company offer?"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "The company offers...",
  "sources": [
    {
      "file": "products.txt",
      "content_preview": "..."
    }
  ],
  "context_used": "Relevant context...",
  "metadata": {
    "execution_time_ms": 1234,
    "num_sources": 3
  }
}
```

---

## 🎨 UI Components

### Chatbot.vue

Main chatbot component with:
- Floating button (collapsed state)
- Chat window (expanded state)
- Message history with user/assistant messages
- PDF source citations
- Typing indicator
- Input area with send button

### Key Features

- **Auto-scroll**: Automatically scrolls to newest message
- **Source Display**: Expandable details showing PDF sources
- **Metadata Display**: Shows execution time and stats
- **Error Handling**: Graceful error messages
- **Responsive**: Adapts to mobile screens

## 📦 Building as Custom Element

For embedding the chatbot as a web component:

```bash
npm run build:ce
```

Then use in any HTML page:

```html
<script src="chatbot.js"></script>
<row-chatbot></row-chatbot>
```

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend"
- **Check backend is running:** Visit http://127.0.0.1:8000/docs
- **Check CORS settings:** Backend must allow requests from your frontend URL
- **Check API URL:** Verify the API endpoint in `my-axios.js`

### Issue: "No response from chat"
- **Check backend has documents:** Add `.txt` files to `backend/app/documents/txts/`
- **Reload documents:** Call the `/chat/reload` endpoint
- **Check backend logs:** Look for errors in the backend console

### Issue: "npm install fails"
- **Clear cache:** `npm cache clean --force`
- **Delete node_modules:** `rm -rf node_modules package-lock.json`
- **Reinstall:** `npm install`

### Issue: "Port 5173 already in use"
- **Change port in vite.config.js**
- Or **kill the process:** `lsof -ti:5173 | xargs kill`

---

## 📦 Dependencies

### Main Dependencies
- **Vue 3** - Progressive JavaScript framework
- **Axios** - HTTP client for API calls
- **Vite** - Next-generation frontend tooling

### Dev Dependencies
- **@vitejs/plugin-vue** - Vue 3 plugin for Vite
- **sass-embedded** - Sass/SCSS support

See `package.json` for complete list.

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized static files.

### Deploy to Static Hosting

Upload the `dist/` folder to:
- **Vercel:** `vercel --prod`
- **Netlify:** Drag & drop the `dist/` folder
- **GitHub Pages:** Push to `gh-pages` branch
- **Any static host:** Upload `dist/` contents

### Environment-Specific Builds

Create `.env` files:

**.env.development:**
```
VITE_API_URL=http://localhost:8000/api/v1
```

**.env.production:**
```
VITE_API_URL=https://api.yoursite.com/api/v1
```

Then update `src/utils/my-axios.js`:
```javascript
baseURL: import.meta.env.VITE_API_URL
```

---

## 🎓 Learning Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Axios Documentation](https://axios-http.com/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

---

## 📝 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run build:ce   # Build as custom element
npm run preview    # Preview production build
```

---

## 📦 Building as Custom Element

For embedding the chatbot as a web component:

```bash
npm run build:ce
```

Then use in any HTML page:

```html
<script src="chatbot.js"></script>
<row-chatbot></row-chatbot>
```

---

## 🔒 Security Notes

- Never expose API keys in frontend code
- Always validate user input
- Use HTTPS in production
- Enable CORS only for trusted origins in production

---

## 🤝 Contributing

This is a student project. Feel free to:
- Report bugs
- Suggest UI/UX improvements
- Submit pull requests
- Add new features

---

## 👨‍💻 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify the backend is running
3. Check the browser console for errors
4. Review network requests in browser DevTools

---

**Happy Coding! 🚀**
