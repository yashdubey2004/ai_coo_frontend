// har har mahadev
# 🖥️ AI-COO Frontend

This is the Next.js React application for the AI-COO (AI Chief Operating Officer) enterprise platform. It features an ultra-premium "Glassmorphism" design system and integrates directly with ElevenLabs for real-time voice interaction.

## 🛠️ Tech Stack
* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **UI Components:** Lucide React (Icons), Recharts (Data Visualization), Framer Motion (Animations)
* **Voice Integration:** `@elevenlabs/react` SDK

## 🎨 Design System: Glassmorphism
This project uses a strict light-theme Glassmorphism aesthetic.
* **Background:** A fluid, soft pastel mesh gradient fixed to the viewport (`bg-gradient-mesh`).
* **Glass Panels:** All cards and containers use the `.glass-panel` utility class (defined in `src/app/globals.css`), which applies `bg-white/40`, `backdrop-blur-md`, and a subtle white border.
* **Colors:** Configured in `tailwind.config.ts`. The primary brand color is Indigo (`#6366f1`).

## ⚙️ Quick Start

### 1. Install Dependencies
```bash
npm install


Create a .env.local file in the root of the frontend directory:

# URL of your local FastAPI backend
NEXT_PUBLIC_API_URL="http://localhost:8000"

npm run dev

# (Optional) For the ElevenLabs Conversational AI Widget
NEXT_PUBLIC_ELEVENLABS_AGENT_ID="your_agent_id_here"

Open http://localhost:3000 in your browser.
