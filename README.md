# Store Backend

Node.js 12 + Express.js + MongoDB API.

## Requirements

- **Node.js 12** (use [nvm](https://github.com/nvm-sh/nvm): `nvm use` or install Node 12)
- **MongoDB** running locally or a connection string

## Setup

```bash
# Install dependencies
npm install

# Copy env and set your MongoDB URI
copy .env.example .env
# Edit .env: set MONGODB_URI if needed (default: mongodb://localhost:27017/store)
```

## Run

```bash
# Start server (connects to MongoDB and listens on PORT)
npm start
```

Default port: **3001** (so Store frontend can run on 3000). The server binds to `0.0.0.0` so it accepts connections from localhost and other interfaces.

**If Store gets "connection refused":** ensure (1) this backend is running (`npm start`), (2) MongoDB is running, (3) Store’s `NEXT_PUBLIC_API_URL` is `http://localhost:3001` (or the port this backend logs on startup).

## CORS

The API sends CORS headers so the Store frontend can call it. Default allowed origins: `http://localhost:3000` and `http://127.0.0.1:3000`. Override with `CORS_ORIGIN` in `.env` (comma-separated).

## Endpoints

- `GET /health` — Health check
- `GET /api` — API info
- **Shop API** (for Store frontend):
  - `GET /api/shop/categories` — Category tree
  - `GET /api/shop/ads` — Ad slides
  - `GET /api/shop/notices` — Important notices
  - `GET /api/shop/products?id=...` — One product
  - `GET /api/shop/products?ids=...` — Products by IDs
  - `GET /api/shop/products?q=&sort=&category=&onsale=` — Filtered/sorted list
  - `GET /api/shop/category?id=...` — Products in category (level1 id)
  - `GET /api/shop/home` — `{ recommended, mostVisited, trending }` product arrays

## Seed & migration

```bash
# Seed MongoDB with default shop data (categories, ads, notices, products, home sections)
npm run seed

# Optional: drop existing shop data before seeding
npm run seed -- --drop

# Ensure indexes exist (run after schema changes)
npm run migrate
```

## Environment

| Variable      | Default                        | Description                    |
|---------------|--------------------------------|--------------------------------|
| `PORT`        | `3001`                         | HTTP server port               |
| `MONGODB_URI` | `mongodb://localhost:27017/store` | MongoDB connection          |
| `CORS_ORIGIN` | `http://localhost:3000`        | Allowed origin(s), comma-separated |
