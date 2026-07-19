# Tractus - A Topic-Based Community Platform

> **Status:** Academic-Safe Development Mode
> **Rule:** Done is better than perfect. Focus on Micro-Tasks.

---

## 📌 PROJECT MEMORY / NEXT ACTIONS
<!-- Academic වැඩ ඉවර වෙලා ආපහු එද්දී කරන්න ඕන පොඩිම දේ මෙතන Update කරන්න -->
- [ ] CURRENT FOCUS: Initialize the projects and database schema.

---

## 🗺️ MVP ROADMAP

### 📁 Phase 1: Database & Backend Architecture (Spring Boot)
- [x] Initialize Spring Boot Web API Project
- [x] Setup JPA/Hibernate with PostgreSQL
- [x] Design Core Schema: Users, Spaces (Topics), Threads, Replies
- [x] Implement JWT Authentication Endpoints (Register / Login)

### 💻 Phase 2: Frontend Core UI (React / Vite)
- [ ] Setup Frontend Project Structure & State Management
- [ ] Design Minimalist Light/Dark Theme Layout
- [ ] Create Login & Registration UI Forms
- [ ] Build Main Dashboard Sidebar with Spaces/Topics list

### 🔄 Phase 3: Core Community Interactions (The Feed)
- [ ] Create API Endpoints for Creating a Thread & Fetching Feed by Topic
- [ ] Integrate Frontend View with the Thread Feed
- [ ] Add Simple Reply / Comment System under Threads
- [ ] Implement Upvote/Like Toggle Functionality

---

## 🏗️ Frontend Architecture (Phase 2)

**Tech Stack:** React (Vite), TypeScript, React Router, Axios, Vanilla CSS.

### 1. The Service Layer (API Integration)
The frontend should not know *how* to talk to the backend inside the UI components. We will abstract all API calls into a dedicated `services/` folder.
* **`api.ts`**: An Axios instance that automatically intercepts requests and injects your JWT token. If a token expires, it can handle logging the user out.
* **`auth.service.ts`**: Handles `/api/auth/login` and `/api/auth/register`.
* **`space.service.ts`**: Handles fetching the topics.

### 2. State Management (Context API)
Instead of passing data down through 10 layers of components (prop-drilling), we will use React's native **Context API**.
* **`AuthContext.tsx`**: Will wrap the entire app. It holds the `currentUser` object and the JWT token. If `currentUser` is null, the app knows to redirect the user to the Login page.

### 3. Folder Structure
```text
tractus_web/
├── src/
│   ├── assets/        # Images, SVG icons
│   ├── components/    # Reusable dumb UI components (Buttons, Cards, Inputs)
│   ├── context/       # AuthContext for global state
│   ├── layouts/       # MainDashboardLayout (Sidebar + Navbar + Main Content area)
│   ├── pages/         # Smart components (LoginPage, SpaceFeedPage, ThreadDetailsPage)
│   ├── services/      # Axios API calls
│   ├── types/         # TypeScript interfaces mapping to your backend DTOs
│   ├── App.tsx        # React Router configuration
│   └── index.css      # Global Design System (Color variables, glassmorphism utilities)
```

### 4. Component Hierarchy (Data Flow)
1. **`App.tsx`** sets up the routes.
2. The user goes to `/login`, hits **`LoginPage`**.
3. User logs in, `AuthContext` saves the JWT in `localStorage` and updates global state.
4. User is redirected to `/` (Root), which loads **`MainDashboardLayout`**.
5. The Layout loads the Sidebar (fetches Spaces) and the main feed area.
