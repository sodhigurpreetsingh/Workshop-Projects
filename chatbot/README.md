# RAG Chatbot Frontend

A Vue.js frontend for a RAG (Retrieval Augmented Generation) chat system that queries PDF documents and provides intelligent answers with source citations.

## 🌟 Features

- **RAG Integration**: Connects to FastAPI backend with RAG capabilities
- **PDF Source Display**: Shows which PDF documents were used to generate answers
- **Execution Time**: Displays response time for each query
- **Modern UI**: Clean, professional black and white design
- **Responsive**: Works on desktop and mobile
- **Floating Widget**: Chat button that can be embedded anywhere

## 📁 Project Structure

```
chatbot/
├── src/
│   ├── components/
│   │   └── Chatbot.vue              # Main chatbot component
│   ├── utils/
│   │   └── my-axios.js              # API configuration
│   ├── App.vue                      # App wrapper
│   ├── main.js                      # Vue app entry point
│   ├── element.js                   # Custom element builder
│   └── style.css                    # Global styles
├── public/                          # Static assets
├── dist/                            # Build output
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── vite.config.js                   # Standard build config
└── vite.ce.config.js                # Custom element build config
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- Backend API running on `http://localhost:8000` (see backend README)

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Access at http://localhost:5173
```

### Build for Production

```bash
# Standard build
npm run build

# Custom element build (for embedding)
npm run build:ce
```

## ⚙️ Configuration

### API Endpoint

Update the backend URL in `src/utils/my-axios.js`:

```javascript
const myAxios = axios.create({
  baseURL: 'http://localhost:8000/api/v1',  // Change to your API URL
  timeout: 60000,
});
```

### Customization

#### Colors & Theme

Edit `src/components/Chatbot.vue` style section:

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

#### Text & Branding

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
      "file": "products.pdf",
      "page": 1,
      "content_preview": "..."
    }
  ],
  "metadata": {
    "execution_time_ms": 1234,
    "documents_retrieved": 3,
    "model_used": "amazon.nova-pro-v1:0"
  }
}
```

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

### Backend Connection Issues

```bash
# Check backend is running
curl http://localhost:8000/health

# Check chat status
curl http://localhost:8000/api/v1/chat/status
```

### CORS Errors

Ensure backend has correct CORS settings in `.env`:

```bash
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Deployment

### 1. Update API URL

In `src/utils/my-axios.js`, change to production URL:

```javascript
baseURL: 'https://your-api-domain.com/api/v1'
```

### 2. Build

```bash
npm run build
```

### 3. Deploy

Deploy the `dist/` folder to:
- **Netlify**: Drop the `dist` folder or connect to Git
- **Vercel**: Import project and set build command to `npm run build`
- **AWS S3 + CloudFront**: Upload `dist` contents to S3 bucket
- **Any static host**: Upload `dist` folder contents

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

Then update `my-axios.js`:
```javascript
baseURL: import.meta.env.VITE_API_URL
```

## 🧪 Testing

### Manual Testing

1. Start backend: `cd ../backend && python -m uvicorn app.main:app --reload`
2. Start frontend: `npm run dev`
3. Open browser to http://localhost:5173
4. Click chat button (bottom right)
5. Test queries:
   - "What products does the company offer?"
   - "What is the pricing?"
   - "Tell me about TechCorp"

### Check Features

- ✅ Messages send and receive
- ✅ PDF sources display
- ✅ Execution time shows
- ✅ Error handling works
- ✅ Mobile responsive
- ✅ Typing indicator appears

## 📚 Tech Stack

- **Vue 3**: Composition API
- **Vite**: Build tool
- **Axios**: HTTP client
- **CSS**: Scoped component styles

## 🔧 Development

### Code Structure

**Composition API Pattern:**
```vue
<script>
import { ref, nextTick } from 'vue';

export default {
  setup() {
    // Reactive state
    const isOpen = ref(false);
    const messages = ref([]);

    // Methods
    const sendMessage = async () => {
      // ... implementation
    };

    // Return public interface
    return { isOpen, messages, sendMessage };
  }
};
</script>
```

### Adding Features

1. **Add new state**: Use `ref()` for reactive data
2. **Add methods**: Define functions in `setup()`
3. **Update template**: Use state and methods with `v-bind` and `@event`
4. **Style**: Add scoped styles in `<style scoped>` section

## 📝 License

MIT License - See LICENSE file

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit pull request

## 📧 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ using Vue 3 and Vite**
