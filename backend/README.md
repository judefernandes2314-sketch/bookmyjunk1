# BookMyJunk Blog Backend

## Quick Setup

### 1. Database
1. Open phpMyAdmin on your hosting
2. Import `database/schema.sql` — this creates all tables and seed data
3. **Important:** Update the admin password hashes in the `admin_users` table

### 2. Configure
```bash
cp .env.example .env
```
Edit `.env` with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=bmj_blog
JWT_SECRET=your_random_secret
FRONTEND_URL=https://yourdomain.com
```

### 3. Install & Run
```bash
cd backend
npm install
node server.js
```

### 4. Frontend
Set the API URL in your frontend environment:
```
VITE_API_URL=https://yourdomain.com:5000
```
Build the frontend:
```bash
npm run build
```
Upload the `dist/` folder to your hosting's `public_html`.

### 5. Generate Password Hashes
Run this to generate a bcrypt hash for your admin password:
```bash
node -e "const b=require('bcryptjs');b.hash('YourPassword',10).then(h=>console.log(h))"
```
Update the hash in phpMyAdmin for your admin users.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/blog` | No | All published posts |
| GET | `/api/blog/:slug` | No | Single post by slug |
| POST | `/api/admin/login` | No | Admin login |
| GET | `/api/admin/posts` | Yes | All posts (incl. drafts) |
| POST | `/api/admin/posts` | Yes | Create post |
| PUT | `/api/admin/posts/:slug` | Yes | Update post |
| DELETE | `/api/admin/posts/:slug` | Yes | Delete post |
| POST | `/api/admin/upload` | Yes | Upload image |
| POST | `/api/admin/import-json` | Yes | Import JSON posts |
| GET | `/api/admin/users` | Yes | List admin users |
| POST | `/api/admin/users` | Yes | Add admin user |
| GET | `/api/admin/roles` | Yes | List roles |
| POST | `/api/admin/roles` | Yes | Create role |

## JSON Import
POST `/api/admin/import-json` with body:
```json
[
  {
    "title": "Post Title",
    "slug": "post-slug",
    "image": "/images/blog/photo.jpg",
    "excerpt": "Short description",
    "content": "<h2>Full HTML</h2><p>content here</p>",
    "author": "Admin"
  }
]
```

## Hosting (HostMyCode / BigRock)
1. Upload backend files via FTP or file manager
2. Import `schema.sql` via phpMyAdmin
3. Install Node.js dependencies via SSH: `npm install`
4. Start with: `node server.js` (or use PM2: `pm2 start server.js`)
5. Upload frontend `dist/` to `public_html`
