# BookMyJunk Blog Backend

Node.js + Express + MySQL blog API.

## Setup

1. `cd backend && npm install`
2. `cp .env.example .env` — fill in MySQL + SMTP credentials
3. Import `database/schema.sql` via phpMyAdmin
4. `mkdir -p uploads`
5. `node server.js`

## New Features

- **Image uploads** — multer → `uploads/` folder, `POST /api/admin/upload`
- **API caching** — node-cache, 60s TTL on public blog endpoints
- **Auto-slug** — slugify with unique duplicate handling
- **Admin approval** — register with `requestAdmin: true`, approval email sent to epr@ecoreco.com + info@ecoreco.com
- **Safe JSON import** — skips duplicate titles, auto-generates slugs
- **Role-based permissions** — admin, author, pending_admin

## SMTP (.env)

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@bookmyjunk.com
```
