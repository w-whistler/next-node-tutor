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

Default port: **3000**.

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

| Variable      | Default                        | Description        |
|---------------|--------------------------------|--------------------|
| `PORT`        | `3000`                         | HTTP server port   |
| `MONGODB_URI` | `mongodb://localhost:27017/store` | MongoDB connection |
