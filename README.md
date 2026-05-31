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
   - Run `npm run seed` in the `backend` folder.
   - **Demo Admin:** admin@saltedhash.com / Admin@1234
   - **Demo Member:** member@saltedhash.com / Member@1234

### Manually Adding Data

You can also manually add data to the JSON files under the `data` folder. For example, to add a new guide, open `data/content/data.json` and append a new JSON object to the array:

```json
  {
    "id": "new-uuid",
    "type": "guide",
    "title": "Your New Guide",
    "slug": "your-new-guide",
    "excerpt": "Short description.",
    "body": "Full body content using markdown format.",
    "tags": ["gardening"],
    "categoryId": "gardening",
    "isPublished": true,
    "publishedAt": "2026-05-31T12:00:00.000Z",
    "requiredTierId": null,
    "createdAt": "2026-05-31T12:00:00.000Z",
    "updatedAt": "2026-05-31T12:00:00.000Z",
    "authorId": "your-admin-id",
    "readTime": 5
  }
```

### Route List (Frontend)

- `/` - Home Page
- `/login` - Login Page
- `/guides` - Guides Library
- `/guides/:id` - Guide Detail Page
- `/plans` - Meal and Garden Plans Workspace (Auth Required)
- `/downloads` - Printable Resources & Downloads
- `/admin` - Admin Dashboard (Admin Role Required)
- `/saved` - Offline Saved Guides (Auth Required)
- `/community` - Community Board
- `/membership` - Membership Pricing and Upgrade Page (Auth Required)
- `/403` - Access Denied
- `/offline` - Offline Fallback Page

### API Endpoints (Backend)

- `GET /api/health` - Health check (Public)
- `POST /api/auth/login` - Login (Public)
- `POST /api/auth/register` - Register (Public)
- `GET /api/content` - Get all published guides (Public)
- `GET /api/content/:id` - Get specific guide (Public/Gated)
- `POST /api/content` - Create a guide (Admin Required)
- `PUT /api/content/:id` - Edit a guide (Admin Required)
- `DELETE /api/content/:id` - Delete a guide (Admin Required)
- `GET /api/downloads` - Get all resources (Public)
- `GET /api/downloads/:id/file` - Get file blob (Public/Gated)
- `GET /api/plans` - Get all user plans (Auth Required)
- `POST /api/plans` - Upsert a plan (Auth Required)
- `DELETE /api/plans/:id` - Delete a plan (Auth Required)
- `GET /api/community` - Get all posts (Public)
- `GET /api/community/:id` - Get specific post with replies (Public)
- `POST /api/community` - Create a post (Auth Required)
- `POST /api/community/:id/reply` - Reply to a post (Auth Required)
- `PATCH /api/memberships/activate` - Upgrade membership (Auth Required)
- `GET /api/admin/stats` - Admin statistics (Admin Required)
- `GET /api/admin/users` - Get all users (Admin Required)
- `PATCH /api/admin/users/:id/role` - Update user role (Admin Required)
- `GET /api/admin/plans` - Get all plans (Admin Required)
- `GET /api/admin/audit` - Get audit log (Admin Required)
- `DELETE /api/admin/downloads/:id` - Delete a download (Admin Required)

### PWA Installation

**Desktop (Chrome/Edge):** Look for the install icon in the address bar when visiting the site, or click the 3-dot menu and select "Install Green Thumb Club".
**Mobile (Safari):** Tap the Share button at the bottom of the screen, then tap "Add to Home Screen".
**Mobile (Chrome):** Look for the "Add to Home Screen" banner or tap the 3-dot menu and select "Add to Home screen".

3. **Start the Application:**
   - **Backend Server:** Run `npm run start` in the backend. The API runs on `http://localhost:3000`.
   - **Frontend App:** Serve the frontend via vite. The UI runs on `http://localhost:5173`.

## Deployment

To deploy this application:
1. Build the frontend.
2. Configure the Express backend to serve the `/frontend/dist` directory as static files (this requires modifying `backend/src/server.ts` to serve the dist directory in a production environment).
3. Ensure the deployment environment allows read/write file system access for the `/data` directory.
