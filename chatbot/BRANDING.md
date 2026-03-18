# SVIET Chatbot Branding

## Logo
- **Location:** `src/images/sviet-logo.svg`
- **Design:** Based on official SVIET logo with:
  - Orange top section (#E8731E) with knowledge tree symbol
  - Blue bottom section (#003D82) with open book
  - "Swami Vivekanand Group of Institutes" text

## Color Palette

### Primary Colors
- **Navy Blue:** `#003D82` - Primary brand color
  - Used for: Header background, buttons, text
- **Orange:** `#E8731E` - Accent color
  - Used for: Borders, highlights, hover states

### Hover States
- **Light Blue:** `#0052A3` - Button/header hover
- **Orange with opacity:** `rgba(232, 115, 30, 0.15)` - Input focus

### Neutral Colors
- **White:** `#FFFFFF` - Message bubbles, backgrounds
- **Light Gray:** `#F5F5F5` - Assistant message background
- **Gray:** `#999999` - Timestamps, metadata

## Typography

**Font Stack:**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
```

**Font Sizes:**
- Header title: 15px (600 weight)
- Header subtitle: 12px (400 weight)
- Message text: 13px
- Timestamps: 11px
- Metadata badges: 11px

## Component Updates

### Header
- **Icon:** SVIET logo (40px × 48px)
- **Title:** "SVIET Assistant"
- **Subtitle:** "Ask anything about SVIET"

### Welcome Message
"Welcome to SVIET! 🎓 I can help answer questions about our programs, placements, facilities, and campus life. What would you like to know?"

### Input Placeholder
"Ask about programs, placements, facilities..."

### Sources Display
- Removed "Page" references (using TXT files)
- Shows document name and content preview
- Orange accent border on sources

## UI Elements

### Floating Button
- Background: #003D82
- Hover: #0052A3
- Icon: Chat bubble SVG

### Message Bubbles
- **User messages:**
  - Background: #003D82 (navy blue)
  - Color: White
  - Aligned: Right

- **Assistant messages:**
  - Background: #F5F5F5 (light gray)
  - Color: #003D82 (navy blue)
  - Aligned: Left

### Input Field
- Border: #E0E0E0
- Focus border: #E8731E (orange)
- Focus shadow: Orange with 15% opacity

### Send Button
- Background: #003D82
- Hover: #0052A3
- Icon: Send arrow (white)

## Professional Styling

- Clean, modern interface
- Professional education institution appearance
- Smooth animations and transitions
- Accessible color contrast
- Mobile responsive design

## Files Modified
- `src/components/Chatbot.vue` - Main component
- `src/images/sviet-logo.svg` - Official logo
