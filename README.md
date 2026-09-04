# FlatVision – AI‑Powered Property Price Prediction

A modern SaaS‑style web application that lets users predict property prices using a Linear Regression model. The stack includes:

- **Frontend** – React 19 + Vite, TailwindCSS, Recharts, Clerk for authentication.
- **Backend / Data** – Supabase (PostgreSQL + Auth + Row‑Level Security).
- **ML Service** – FastAPI (Python) serving the regression model.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 20 |
| npm / yarn | latest |
| Python | >= 3.10 |
| pip | latest |
| Supabase CLI | latest (optional – for local dev) |
| uvicorn | latest |

Make sure you have a **Supabase project** set up and the required environment variables added to the frontend `.env` file (see the `.env.example` in the `frontend` folder).

---

## Quick Start

```bash
# 1️⃣ Clone the repo (if you haven't already)
git clone https://github.com/RajanyaMondal/flatvision.git
cd flatvision
```

### Frontend (React)

```bash
# Install dependencies
cd frontend
npm ci   # or `npm install`

# Run the development server (hot‑reloading)
npm run dev
```

The UI will be available at **http://localhost:5173**.

---

### ML Service (FastAPI)

```bash
# Install Python deps (inside a virtualenv is recommended)
cd ml
python -m venv .venv
source .venv/bin/activate   # on Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app:app --host 0.0.0.0 --port 8000
```

The prediction endpoint is exposed at **http://localhost:8000/predict**.

---

### Supabase (Database & Auth)

If you want to run Supabase locally (optional):

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Start Supabase locally (docker required)
cd ..   # back to repo root
supabase start
```

Otherwise, simply point the frontend to your remote Supabase project's URL & `anon` key via the `.env` file.

---

## Environment Variables (`frontend/.env`)

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY
VITE_ML_SERVICE_URL=http://localhost:8000   # change if hosted elsewhere
```

---

## Building for Production

```bash
# Frontend
cd frontend
npm run build   # creates a static bundle in `dist/`

# ML Service (Docker example)
cd ../ml
docker build -t flatvision-ml .
docker run -p 8000:8000 flatvision-ml
```

---

## License

MIT © FlatVision contributors