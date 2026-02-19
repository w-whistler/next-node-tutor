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

## Environment

| Variable      | Default                        | Description        |
|---------------|--------------------------------|--------------------|
| `PORT`        | `3000`                         | HTTP server port   |
| `MONGODB_URI` | `mongodb://localhost:27017/store` | MongoDB connection |
