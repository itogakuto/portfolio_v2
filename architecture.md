
# Architecture & Design Plan

## 1. Architecture Proposals

### Proposal A: Headless Modern (Recommended)
- **Frontend**: React 18 + Tailwind CSS + Framer Motion (Interactions) + Three.js (3D).
- **CMS Logic**: Integrated Client-side CMS Engine using `localStorage` for persistence (in this environment) or an API-based state management.
- **Reason**: Allows for highly granular control over transitions and 3D scene synchronization without full page reloads.

### Proposal B: Fullstack SSR (Node/Express/EJS)
- **Backend**: Node.js + Express + EJS/Pug.
- **Database**: PostgreSQL / MongoDB.
- **Reason**: Better for SEO, but harder to achieve the ultra-smooth "Lusion.cc" style transitions without complex PJAX/Barba.js logic.

**Recommendation**: **Proposal A (React SPA with Integrated CMS)**. It maximizes "feel" and performance while keeping the CMS deeply integrated with the UI state.

---

## 2. Data Model Definition

### Topics
- `id`: string
- `category`: 'Projects' | 'Works' | 'Others'
- `title`: string
- `slug`: string
- `summary`: string
- `body`: text (Markdown)
- `tags`: string[]
- `media`: string[] (Images/Video URLs)
- `featured`: boolean
- `status`: 'draft' | 'published'
- `publishedAt`: date

### News
- `id`: string
- `title`: string
- `category`: string
- `shortText`: string
- `body`: text (Markdown)
- `date`: date
- `status`: 'draft' | 'published'

### Activity (Timeline)
- `id`: string
- `title`: string
- `date`: date
- `summary`: string
- `tags`: string[]
- `featured`: boolean

---

## 3. Implementation Phases

1. **Phase 1: Foundation (MVP)**
   - Setup React, Routing, and global Theme (Deep Blue).
   - Implement CMS Data Engine (State Management + LocalStorage Persistence).
   - Basic CRUD for Topics/News/Activities.

2. **Phase 2: Visual & 3D Layer (Rich Experiences)**
   - Three.js background scene (Particle Flow).
   - Scroll-driven animations using Framer Motion.
   - Page transitions and glassmorphism UI.

3. **Phase 3: Optimization & Polish**
   - Performance tuning (Three.js disposal, FPS capping).
   - Mobile responsiveness.
   - Seed data and final UI refinement.
