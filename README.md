# Frontend - CalmSphere React App

## 📋 Overview

Modern, responsive React frontend for CalmSphere, featuring guided breathing exercises with beautiful animations, mood tracking, and wellness features.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

App will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📂 Project Structure

```
src/
├── components/
│   ├── BreathingExercise.jsx      # Main breathing exercise component
│   ├── BreathingCircle.jsx         # Animated breathing circle
│   ├── MoodTracker.jsx             # Mood tracking interface
│   ├── MoodChart.jsx               # Mood visualization chart
│   ├── Dashboard.jsx               # User dashboard
│   ├── Navbar.jsx                  # Navigation bar
│   ├── Auth.jsx                    # Login/Register forms
│   └── *.css                       # Component styles
├── pages/                          # Page components
├── services/
│   └── api.js                      # API service layer
├── hooks/
│   ├── useAuth.js                  # Authentication hook
│   └── useTheme.js                 # Theme management hook
├── utils/
│   └── constants.js                # App constants
├── styles/
│   ├── colors.js                   # Color definitions
│   └── globalStyles.js             # Global styles
├── App.jsx                         # Root component
├── main.jsx                        # Entry point
└── index.css                       # Global CSS
```

## 🎨 Component Documentation

### BreathingExercise
Main component for guided breathing exercises.

**Props:** None (uses local state)

**Features:**
- Mode selection (Relax, Calm, Focus, Sleep)
- Duration selection (1, 3, 5, 10 minutes)
- Soundscape selection with icons
- Real-time timer and progress display
- Animation toggle for performance

```jsx
<BreathingExercise />
```

### BreathingCircle
Animated circle component that guides breathing.

**Props:**
- `mode` (string) - Current breathing mode
- `isActive` (boolean) - Whether exercise is active
- `phase` (string) - Current phase (inhale/exhale/hold/pause)
- `progress` (number) - Phase progress (0-1)

```jsx
<BreathingCircle 
  mode="Calm" 
  isActive={true}
  phase="inhale"
  progress={0.5}
/>
```

### MoodTracker
Mood and stress tracking interface.

**Props:** None (uses local state and API)

**Features:**
- 5-option mood selector
- 1-10 stress level slider
- Notes textarea
- Mood history display
- Weekly statistics

```jsx
<MoodTracker />
```

### Dashboard
User dashboard showing progress and statistics.

**Props:**
- `user` (object) - Current user data

**Displays:**
- Daily affirmation card
- Statistics grid (sessions, minutes, streak)
- Breathing mode preferences
- Soundscape usage

```jsx
<Dashboard user={user} />
```

### Navbar
Navigation and theme control.

**Props:**
- `user` (object) - Current user
- `onLogout` (function) - Logout handler
- `theme` (string) - Current theme
- `onThemeToggle` (function) - Theme toggle handler

```jsx
<Navbar 
  user={user} 
  onLogout={handleLogout}
  theme="light"
  onThemeToggle={toggleTheme}
/>
```

### Auth
Login and registration form.

**Props:**
- `onAuthSuccess` (function) - Success callback

```jsx
<Auth onAuthSuccess={handleSuccess} />
```

## 🔌 API Integration

The app communicates with the backend via the API service:

```javascript
import { 
  authService, 
  sessionService, 
  moodService, 
  affirmationService 
} from './services/api';

// Authentication
await authService.register(name, email, password);
await authService.login(email, password);
await authService.getProfile();

// Sessions
await sessionService.createSession(mode, duration, sound, notes);
await sessionService.getHistory();
await sessionService.getStats();

// Mood
await moodService.createMood(mood, stressLevel, notes);
await moodService.getHistory();
await moodService.getStats();

// Affirmations
await affirmationService.getDailyAffirmation();
await affirmationService.saveAffirmation(id);
await affirmationService.getSavedAffirmations();
```

## 🎨 Styling & Theming

### Color System

The app uses CSS custom properties for theming:

```css
--bg-primary: #ffffff
--bg-secondary: #f5f7fa
--text-primary: #2c3e50
--text-secondary: #7f8c8d
--border-color: #e0e0e0
```

### Theme Toggle

```javascript
import useTheme from './hooks/useTheme';

const { theme, toggleTheme, isDark } = useTheme();
```

### Light/Dark Mode

Automatically switches based on system preference or user selection. Stored in localStorage.

## 🎬 Animations

The app features smooth CSS animations:

- Breathing circle scaling
- Floating particles
- Gradient blob movements
- Smooth transitions (0.3s)
- Hover effects with transforms
- Slide and fade animations

## 📱 Responsive Design

### Breakpoints
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

### Mobile Features
- Sticky bottom controls
- Touch-friendly buttons (44px minimum)
- Optimized layouts
- Hamburger navigation menu

## 🔐 Authentication

The app uses JWT token-based authentication:

```javascript
// Login
const response = await authService.login(email, password);
localStorage.setItem('token', response.data.token);

// Token is automatically added to all requests
// via axios interceptors
```

**Token Storage:**
- Stored in localStorage
- Automatically restored on page reload
- Cleared on logout

## 🧪 Custom Hooks

### useAuth
Manages authentication state.

```javascript
const { user, token, login, logout, isAuthenticated } = useAuth();
```

### useTheme
Manages theme and dark mode.

```javascript
const { theme, toggleTheme, isDark } = useTheme();
```

## 📦 Dependencies

- **react** - UI library
- **react-dom** - React DOM rendering
- **react-router-dom** - Client-side routing
- **axios** - HTTP client
- **chart.js** - Chart library
- **react-chartjs-2** - React charts
- **vite** - Build tool

## 🛠️ Development

### Code Style
- ES6+ syntax
- Functional components with hooks
- Component-based architecture
- CSS modules and inline styles
- Proper prop validation

### Best Practices
- Reusable components
- Custom hooks for logic
- Service layer for API calls
- Error handling
- Loading states
- Responsive design first

## 📊 Performance Optimizations

- Lazy loading animations (toggle option)
- Efficient re-renders with useCallback
- CSS animations instead of JS
- Optimized chart rendering
- Image optimization

## 🚀 Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

**Output includes:**
- Minified JavaScript
- Optimized CSS
- Asset optimization
- Source maps (optional)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file (not tracked in git):

```env
VITE_API_URL=http://localhost:5000/api
```

## 📝 Tips for Customization

### Changing Colors
Edit `/src/styles/colors.js`:

```javascript
export const colors = {
  light: {
    primary: '#E8F4F8',
    // ... more colors
  }
}
```

### Adding Components
Follow this structure:

```
components/
├── YourComponent.jsx    # Component logic
├── YourComponent.css    # Component styles
└── index.js            # Optional export
```

### Modifying Animations
Edit individual `.css` files or update global animation keyframes in `index.css`.

## 🐛 Troubleshooting

### API Connection Issues
1. Ensure backend is running on `localhost:5000`
2. Check CORS configuration
3. Verify MongoDB is connected

### Authentication Problems
1. Clear localStorage
2. Check JWT token expiration
3. Verify backend JWT_SECRET

### Styling Issues
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check CSS class names

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)

---

**Frontend Ready for Deployment!**
