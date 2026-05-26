# SALTEDHASH PWA MVP

A progressive web application MVP built for the Natural Living & Urban Gardening product line. This system provides a full-stack content-commerce structure utilizing Vue 3, Vite, and Express, powered by a local JSON file-based storage architecture.

## Architecture

- **Frontend:** Vue 3 + Vite, Vue Router, Pinia (State Management), TailwindCSS.
- **PWA Capabilities:** App shell routing, Service Worker with caching (offline support), `manifest.webmanifest`.
- **Backend:** Express API, JWT authentication with bcrypt hashing.
- **Storage:** JSON flat-files (NoSQL local storage) under the `/data` folder.

## Setup & Running Locally

1. **Install Dependencies:**
   - From the root, install backend and frontend dependencies.

2. **Seed Initial Data:**
   - Pre-populate JSON storage with admin and member demo accounts, along with test content.
   - Run `npm run seed` in the backend folder.
   - **Demo Admin:** admin@saltedhash.com / admin123
   - **Demo Member:** member@example.com / member123

3. **Start the Application:**
   - **Backend Server:** Run `npm run start` in the backend. The API runs on `http://localhost:3000`.
   - **Frontend App:** Serve the frontend via vite. The UI runs on `http://localhost:5173`.

## Deployment

To deploy this application:
1. Build the frontend.
2. Configure the Express backend to serve the `/frontend/dist` directory as static files (this requires modifying `backend/src/server.ts` to serve the dist directory in a production environment).
3. Ensure the deployment environment allows read/write file system access for the `/data` directory.
