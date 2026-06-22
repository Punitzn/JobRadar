# JobRadar

A crowdsourced job-hunting intelligence platform for Indian CS students and tech job seekers. JobRadar aggregates community-reported hiring data to surface company ghost rates, hiring trends, and application outcome patterns — helping candidates apply smarter, not harder.

**[Live Demo](https://your-live-link.vercel.app)** · **[Backend API](https://your-backend-link.com)**

---

## What it does

Most job boards show you open roles. JobRadar shows you what actually happens after you apply.

- **Heatmap visualization** of hiring activity and ghost rates across companies in the Indian tech market
- **Crowdsourced data ingestion** — users report their application outcomes (applied, ghosted, interviewed, offered)
- **Filtering and analytics** — filter by company, role type, experience level, and time period
- **Aggregated insights** — see which companies are actively hiring vs which ones ghost most applicants

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Querying | MongoDB Aggregation Pipelines |
| Deployment | Vercel (frontend), Render (backend) |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/reports` | Submit a job application outcome |
| `GET` | `/api/companies` | Get all companies with aggregated stats |
| `GET` | `/api/companies/:id` | Get detailed stats for a specific company |
| `GET` | `/api/analytics/heatmap` | Get heatmap data — ghost rates by company/time |
| `GET` | `/api/analytics/trends` | Get hiring trend data across the market |

---

## Running locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas URI (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/Punitzn/jobradar.git
cd jobradar
```

### 2. Setup backend

```bash
cd server
npm install
cp .env.example .env
# Fill in MONGODB_URI and PORT in .env
npm run dev
```

### 3. Setup frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:5000`

---

## Environment variables

```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
CLIENT_URL=http://localhost:5173
```

---

## Project status

Actively maintained. Beta users onboarded from MBM University and Indian CS student communities. Iterating based on user feedback.

---

## Author

**Punit Jain** — [LinkedIn](https://linkedin.com/in/punit-jain) · [GitHub](https://github.com/Punitzn)
