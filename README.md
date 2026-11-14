# Smart Learning Portal

Smart Learning Portal is a full-stack LMS for students and teachers, built with React, Vite, Tailwind CSS, Express, MongoDB, Mongoose, bcrypt, and JWT.

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- MongoDB running locally or through a hosted connection

## Setup

Install dependencies from the project root:

```bash
npm install --prefix client
npm install --prefix server
```

Create local environment files:

```powershell
Copy-Item client/.env.example client/.env
Copy-Item server/.env.example server/.env
```

Configure `server/.env` with `MONGODB_URI`, `JWT_SECRET`, `PORT`, and `CLIENT_URL`. Secrets are never stored in the frontend or committed to source control. The client uses `VITE_API_URL` from `client/.env`.

If PowerShell blocks `npm.ps1`, use `npm.cmd` in the commands below.

## Run locally

Open two terminals:

```bash
npm run dev --prefix client
npm run dev --prefix server
```

The Vite client is normally available at `http://localhost:5173` and the API at `http://localhost:5000`.

Verify the API:

```text
GET http://localhost:5000/api/health
{ "success": true, "message": "Server is running" }
```

Build the frontend and run the backend without watchers:

```bash
npm run start --prefix server
```

For a production frontend build, provide the deployed backend URL through `VITE_API_URL`:

```powershell
$env:VITE_API_URL="https://your-api.onrender.com/api"
npm run build --prefix client
Remove-Item Env:VITE_API_URL
```

## Production deployment

The frontend is prepared for Vercel and the backend is prepared for Render. Deploy them as separate services from the same repository.

Vercel frontend settings:

- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL=https://your-api.onrender.com/api`

The Vercel SPA rewrite is defined in `client/vercel.json`, so React Router pages continue to work when opened directly.

Render backend settings:

- Service type: Web Service
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables: `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`

Set `CLIENT_URL` to the deployed Vercel URL, for example `https://your-portal.vercel.app`. Multiple allowed frontend origins may be comma-separated. The server listens on `0.0.0.0` and uses Render's `PORT` value.

MongoDB Atlas is supported through `MONGODB_URI`. Configure Atlas network access and a database user before deploying the backend. Do not put Atlas credentials or `JWT_SECRET` in GitHub; configure them in Render's environment settings.

The current local PDF upload implementation stores files in `server/uploads`. For production persistence across redeployments, use a persistent disk or object storage such as S3 or Cloudinary.

## Implemented workflows

Students and teachers can register and log in with bcrypt-hashed passwords and JWT sessions. Protected routes enforce the selected role and redirect users to the correct dashboard. Logout clears the local session.

Students have responsive pages for:

- Dashboard and course enrollment
- Recorded sessions
- YouTube embeds and direct MP4/WebM/OGG playback
- Lecture details, teacher/module information, and descriptions
- PDF study-material downloads
- Assignment list, deadline warnings, and student submissions
- Bookmarks
- Doubt discussion
- Profile updates

Teachers have responsive pages for:

- Dashboard overview
- Course creation, editing, publishing, and deletion
- Module creation, editing, and deletion
- Lecture creation, editing, deletion, and publishing
- YouTube/direct video URL entry
- PDF note uploads and deletion
- Assignment file uploads, deadlines, publishing, and deletion
- Profile updates

No attendance tracking or present/absent markers are included.

## API areas

- `/api/health`
- `/api/auth`
- `/api/courses`
- `/api/enrollments`
- `/api/modules`
- `/api/lectures`
- `/api/study-materials`
- `/api/bookmarks`
- `/api/doubts`
- `/api/assignments`

Uploaded PDFs are stored in `server/uploads` for local development and served through `/uploads`. For production, move file storage to an object-storage service and add access controls appropriate for the deployment.

## Project structure

```text
client/
  src/
    assets/
    components/
    context/
    layouts/
    pages/
    services/
server/
  config/
  controllers/
  middleware/
  models/
  routes/
  uploads/
```
