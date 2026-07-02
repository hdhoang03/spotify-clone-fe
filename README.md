# Springtunes Client (Frontend)

Springtunes is a high-quality streaming application inspired by Spotify, built with **React 19**, **TypeScript**, and **Vite**. The project aims to deliver a modern (Premium Aesthetics), smooth, and multilingual interface, equipped with specific optimizations to ensure stable performance on older devices.

---

## Key Features

### 1. AI Companion & Discovery
- **Gemini API Integration**: An intelligent AI assistant that allows natural language search and provides personalized music recommendations based on user preferences.
- **Dynamic Chat Interface**: Features Markdown-supported chat bubbles (`react-markdown`) for clear information presentation, displaying music recommendations directly within the intuitive Chat FAB.

### 2. Premium Aesthetics & User Experience
- **Dynamic Theme System**: Comprehensive customization of primary colors (`primary-*`), replacing the traditional fixed green color, complete with Light/Dark Mode support.
- **Intelligent Color Synchronization**: Utilizes the `fast-average-color` library to automatically extract dominant colors from song/playlist cover art. This color is applied as a smooth dynamic gradient background.
- **Premium Account Perks**: Premium users receive a dynamic glowing aura around their avatars, a sparkling crown, and an exclusive Golden Shimmer Name Effect.

### 3. Advanced Audio Player
Supports 3 flexible playback states tailored to user interaction needs:
- **MiniPlayer**: A smart, compact player with drag-and-drop support, allowing placement anywhere on the screen.
- **Sidebar Player**: Integrated directly alongside the navigation bar to minimize workspace clutter.
- **Fullscreen Player**: A stunning fullscreen playback mode featuring real-time scrolling lyrics and detailed artist information.
- **Queue & Autoplay**: Automatically continues playback with related tracks when the current playlist ends.

### 4. Discovery & Library Management
- **Playlist Search**: Quick search filters for songs and artists within Playlists and Liked Songs, operating smoothly on both desktop and mobile.
- **Real-time Notification Sync**: Instant updates for unread notification counts, synchronizing immediately upon reading or deleting notifications.

### 5. Low Performance Mode
- **Effect Disabling**: Provides a quick toggle in settings to disable all transitions, background blurs (`backdrop-blur`), and complex keyframe animations.
- **Benefits**: Optimizes FPS and prevents Reflow/Repaint issues, ensuring extremely smooth operation on older or low-spec devices.

### 6. Profile Sharing & QR Codes
- **Profile Share Card**: Exports beautifully designed personal profile cards as high-quality images with automated QR codes (using `html-to-image` and `qrcode.react`) for quick social media sharing.
- **Visual Profile Editing**: Avatar modification equipped with a precise image cropping tool (`react-easy-crop`).

### 7. Advanced API Client (`api.ts`)
The application's HTTP request coordinator features highly robust processing mechanisms:
- **Endpoint Fallback**: If an API server encounters a network error (`ERR_NETWORK`), the application automatically switches to the next fallback API address in the configuration and retries the request instantly without disrupting the user experience.
- **Mutex-based Refresh Token Queue**: When multiple concurrent requests are rejected due to an expired token (401 Error), the interceptor holds these requests in a queue. The application sends only 1 refresh token request to the backend. Upon receiving the new token, it automatically distributes it to all pending requests and resumes execution.
- **Ngrok Support**: Automatically attaches the `'ngrok-skip-browser-warning': 'true'` header, bypassing the warning screen when developers use ngrok as a tunnel for local API testing.

### 8. Internationalization (i18n)
- Full support for **4 languages**: **English (EN)**, **Vietnamese (VI)**, **Korean (KO)**, and **Japanese (JA)**.

---

## Technologies Used

- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Vanilla CSS
- **Animations**: Framer Motion
- **State Management**: Zustand (Manages audio player state, playback queue, and UI settings)
- **API Client**: Axios
- **Localization**: i18next & i18next-browser-languagedetector
- **Media Helpers**: fast-average-color, html-to-image, qrcode.react, react-easy-crop
- **Markdown & AI**: react-markdown (Renders AI-generated text)
- **Icons**: Lucide React
- **Charts**: Recharts (Used in the Admin Dashboard)

---

## Project Structure

```bash
src/
├── components/          # Main UI components
│   ├── AICompanion/     # AI Assistant, Chat FAB, and Markdown processing
│   ├── Account/         # Account management (Profile, Security, Premium Subscription)
│   ├── Admin/           # Admin dashboard, statistical charts
│   ├── Artist/          # Artist page, discography, top tracks
│   ├── Auth/            # Login, Registration, OTP, Google OAuth, ReCAPTCHA v3
│   ├── Header/          # Top navigation bar, notification bell
│   ├── HomePage/        # Homepage, trending categories, system footer
│   ├── MusicPlayer/     # Audio player (Mini, Fullscreen, Sidebar, Lyrics)
│   ├── Profile/         # User profile, profile sharing, blocklist management
│   ├── Search/          # Global search and genre filters
│   ├── Settings/        # Language, privacy, and Low Performance Mode settings
│   ├── Sidebar/         # Navigation sidebar and personal Library
│   ├── Shared/          # Reusable components
│   └── common/          # Basic utility components (Toast, Loader, Button, etc.)
├── contexts/            # Global Context API
├── hooks/               # Global custom hooks
├── locales/             # Language files (vi.json, en.json, ko.json, ja.json)
├── services/            # API interaction services (likeApi, notificationService, api.ts)
├── utils/               # Helper utility functions
├── App.tsx              # Main Router and Layout configuration
├── main.tsx             # Application entry point
└── index.css            # Global styles and CSS optimization variables
```

---

## Installation & Setup

### System Requirements
- **Node.js** (LTS version v18 or higher recommended).
- Package Manager: **npm** or **yarn**.

### Step 1: Clone the Repository
```bash
git clone https://github.com/hdhoang03/spotify-clone-fe.git
cd spotify-clone-fe
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory (alongside `package.json`) and add the following configuration:
```env
# Backend API address (Multiple comma-separated URLs can be provided to enable fallback mechanism)
VITE_API_URL=http://localhost:8080/spotify,https://spotify-clone-8xkm.onrender.com

# Google reCAPTCHA v3 Public Key
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

### Step 4: Start the Development Server
```bash
npm run dev
```
The application will run at: `http://localhost:5173`

### Step 5: Build for Production
```bash
npm run build
```
The optimized and minified source code will be located in the `/dist` directory.
