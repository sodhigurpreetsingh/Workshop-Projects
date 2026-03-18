# AI Resume Analyzer Frontend

A modern Vue.js 3 frontend application for the AI-powered Resume Analyzer. Upload your resume and get instant feedback including ATS score, strengths, weaknesses, and actionable suggestions for improvement.

---

## 🚀 Features

- 📄 **Resume Upload** - Support for PDF and DOCX formats
- 🎯 **ATS Score** - Get your Applicant Tracking System compatibility score
- ✅ **Strengths Analysis** - Identify what's working well in your resume
- ⚠️ **Weakness Detection** - Find areas that need improvement
- 💡 **Actionable Suggestions** - Get specific recommendations to enhance your resume
- 🔑 **Keyword Extraction** - See key skills and technologies in your resume
- ⚡ **Instant Results** - AI-powered analysis in seconds
- 🎨 **Modern Design** - Clean, professional user interface

---

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
cd resume-analyzer
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

Preview the production build:

```bash
npm run preview
```

---

## 📁 Project Structure

```
resume-analyzer/
├── public/               # Static assets
├── src/
│   ├── components/       # Vue components
│   │   └── ResumeAnalyzer.vue  # Main analyzer component
│   ├── App.vue          # Root component
│   ├── main.js          # Application entry point
│   └── style.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

---

## 🔌 API Configuration

The frontend connects to the backend API at `http://127.0.0.1:8000/api/v1`

To change the API endpoint, edit the API URL in your components:

```javascript
// In src/components/ResumeAnalyzer.vue
const API_URL = 'http://127.0.0.1:8000/api/v1';
```

---

## 🎨 How to Use the Resume Analyzer

1. **Start the Backend API**
   - Make sure the backend is running on port 8000
   - Verify OpenAI API key is configured in backend `.env`

2. **Start the Frontend**
   - Run `npm run dev`
   - Open http://localhost:5173

3. **Upload Your Resume**
   - Click the upload area or drag & drop your resume
   - Supported formats: PDF, DOCX
   - File size limit: Usually 10MB (configured in backend)

4. **Review Analysis**
   - **ATS Score:** 0-100 rating for ATS compatibility
   - **Strengths:** What's working well in your resume
   - **Weaknesses:** Areas that need improvement
   - **Suggestions:** Specific actionable recommendations
   - **Keywords:** Key skills and technologies identified

5. **Improve Your Resume**
   - Apply the suggested improvements
   - Re-upload to see your improved score
   - Iterate until you're satisfied

---

## 🧪 Testing

### Manual Testing

1. **Test with Sample Resumes:**
   - Create test resumes with different qualities
   - Upload and verify analysis results
   - Check all sections display correctly

2. **Test File Types:**
   - Try PDF files
   - Try DOCX files
   - Try unsupported formats (should show error)

3. **Test Edge Cases:**
   - Very short resume (should warn)
   - Very long resume
   - Resume with special characters
   - Empty file

### Test Without Backend

If the backend is not running, the app will show connection errors. Make sure:
- Backend is running on `http://127.0.0.1:8000`
- Backend has OpenAI API key configured
- CORS is enabled in the backend

---

## 🔧 Configuration

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
VITE_MAX_FILE_SIZE=10485760  # 10MB in bytes
```

Then use in your code:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
const MAX_FILE_SIZE = import.meta.env.VITE_MAX_FILE_SIZE;
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend"
- **Check backend is running:** Visit http://127.0.0.1:8000/docs
- **Check CORS settings:** Backend must allow requests from your frontend URL
- **Check API URL:** Verify the API endpoint in your component

### Issue: "File upload fails"
- **Check file format:** Only PDF and DOCX are supported
- **Check file size:** File may be too large
- **Check backend logs:** Look for error messages
- **Verify OpenAI key:** Backend needs valid OpenAI API key

### Issue: "Analysis takes too long"
- **OpenAI API may be slow:** Wait up to 30 seconds
- **Check OpenAI credits:** Ensure your account has credits
- **Check network connection:** Verify internet connectivity

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

## 🎨 Customization

### Styling

Global styles are in `src/style.css`. Component-specific styles are in each `.vue` file.

To customize colors, edit the CSS variables:

```css
:root {
  --primary-color: #6366f1;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --background-color: #f9fafb;
}
```

### Score Thresholds

Customize ATS score color coding:

```javascript
// Good score (green)
if (score >= 80) return 'excellent';
// Average score (yellow)
if (score >= 60) return 'good';
// Poor score (red)
return 'needs-improvement';
```

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
- **AWS S3:** Upload to S3 bucket with static hosting
- **Any static host:** Upload `dist/` contents

---

## 📊 Understanding the Analysis

### ATS Score (0-100)
- **80-100:** Excellent - Very ATS-friendly
- **60-79:** Good - Some improvements needed
- **40-59:** Fair - Multiple issues to address
- **0-39:** Needs Work - Major improvements required

### Strengths
Look for:
- Quantifiable achievements
- Strong action verbs
- Relevant skills
- Professional formatting

### Weaknesses
Common issues:
- Missing contact information
- Lack of quantifiable results
- Poor formatting
- Irrelevant information
- Too long or too short

### Suggestions
Typically include:
- Add specific metrics
- Improve section headings
- Optimize keywords
- Fix formatting issues
- Add missing sections

---

## 🎓 Learning Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Resume Writing Best Practices](https://www.indeed.com/career-advice/resumes-cover-letters)
- [ATS Optimization Tips](https://www.jobscan.co/blog/ats-resume/)

---

## 📝 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## 🔒 Security Notes

- Never store uploaded resumes on the client
- Resumes are sent to backend via secure connection
- Backend should validate and sanitize all uploads
- Use HTTPS in production
- Implement rate limiting to prevent abuse

---

## 🤝 Contributing

This is a student project. Feel free to:
- Report bugs
- Suggest UI/UX improvements
- Add new analysis features
- Improve scoring algorithm
- Submit pull requests

---

## 💡 Future Enhancements

Potential features to add:
- Save analysis history
- Compare multiple resumes
- Export analysis as PDF
- Job-specific optimization
- Resume templates
- Real-time editing suggestions
- Multi-language support

---

## 👨‍💻 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify the backend is running and configured
3. Check the browser console for errors
4. Review network requests in browser DevTools
5. Ensure OpenAI API key is valid in backend

---

**Good luck with your resume! 🎯**
