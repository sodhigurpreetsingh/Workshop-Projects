# Campus Assistant Branding

This chatbot is a generic, reusable demo built for **Demo Institute of Technology (DIT)**
— a fictional college used for teaching purposes. Swap the content in
`backend/app/documents/txts/` and the text below to point it at any institution.

## Logo

No external logo asset is used. The header icon is an inline SVG mortarboard
mark defined directly in `src/components/Chatbot.vue`, styled to sit on a
translucent white tile over the gradient header. This keeps the component
fully self-contained — no image files to swap when re-branding.

## Color Palette

Matches the design system used across the other MSET workshop demo assets.

### Primary Colors
- **Indigo:** `#4f46e5` (`--cb-primary`) — header, buttons, user message bubbles
- **Violet:** `#8b5cf6` (`--cb-secondary`) — paired with indigo in gradients
- **Emerald:** `#10b981` (`--cb-accent`) — source citation accent border

### Hover / Focus States
- **Indigo (darker):** `#4338ca` (`--cb-primary-dark`)
- **Focus ring:** `rgba(79, 70, 229, 0.13)` — input focus glow

### Neutrals
- **Ink:** `#16181f` (`--cb-ink`) — primary text
- **Ink soft:** `#454a58` (`--cb-ink-soft`) — secondary text
- **Muted:** `#6b7280` (`--cb-muted`) — timestamps, metadata
- **Surface 2:** `#f7f7fb` (`--cb-surface-2`) — messages background

## Typography

**Font Stack:**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
```
Inter is loaded via Google Fonts in `index.html`; the stack falls back
gracefully to system fonts if it fails to load.

**Font Sizes:**
- Header title: 15px (700 weight)
- Header subtitle: 12px (400 weight)
- Message text: 13px
- Timestamps: 10.5px
- Metadata badges: 10.5px

## Component Content

### Header
- **Icon:** inline SVG mortarboard mark
- **Title:** "Campus Assistant"
- **Subtitle:** "Ask me about DIT"

### Welcome Message
"Welcome to Demo Institute of Technology! 🎓 I can help answer questions about
our programs, placements, facilities, and campus life. What would you like to know?"

### Input Placeholder
"Ask about programs, placements, facilities..."

### Sources Display
- Shows document name and content preview (no page numbers — plain-text sources)
- Emerald accent border on source cards

## Re-branding for a Different Institution

To point this at a real (or different demo) institution:
1. Update the header title/subtitle and welcome message in `src/components/Chatbot.vue`
2. Update the color variables at the top of the `<style>` block in the same file
3. Replace the content in `backend/app/documents/txts/*.txt` with the new institution's facts
4. Restart the backend — documents are re-indexed in memory on startup, no cache to clear
