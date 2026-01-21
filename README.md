
# Nexus Portfolio & CMS

A luxury interaction design portfolio with integrated management console.

## Local Development

1. Clone or download the repository.
2. Install dependencies (React 18, Three.js, Framer Motion, Tailwind).
3. Run `npm run dev`.
4. CMS Password: `admin123`

## Deployment Instructions

This app is a standard React SPA using `HashRouter` for maximum compatibility with static hosting.

### Vercel / Netlify / Firebase Hosting
1. Build the project: `npm run build`.
2. Push to your Git repository.
3. Point your hosting service to the `dist` or `build` folder.
4. (Optional) Set up Environment Variables if you integrate with external APIs.

## CMS Persistence
Data is currently persisted via `localStorage` to ensure functionality in sandboxed environments. In a production environment, simply replace the `upsert` logic in `CMSContext.tsx` with calls to your favorite API (Supabase, Firebase, or Node/Express).

## Key Features
- **3D Particles**: Three.js background reacting to state changes.
- **Glassmorphism**: Modern UI using backdrop-blur and thin outlines.
- **Scroll Animations**: Smooth entrance animations using Framer Motion.
- **Full CMS**: Manage Topics, News, and Activities directly from the hidden admin console.
