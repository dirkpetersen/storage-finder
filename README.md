# storage-finder

Which storage should I pick

A small self-service tool that helps university users pick the right storage
service (Box, OneDrive, SharePoint, shared drives, Tier 1/2/3 research storage,
and more) based on data classification, audience, size, backup needs, workload,
and whether to stay within a free quota or pay.

## Run it

```bash
pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```

Then open http://127.0.0.1:8000

- `/` front page explaining the two tools
- `/simple` pick tiles, compare matching services side by side
- `/wizard` six guided questions with a ranked recommendation

The app reads its port from the `PORT` environment variable (default `8000`),
so it also runs as `PORT=8080 python -m backend.app.main`.

## Deploying with appmotel

This repo follows [appmotel](https://github.com/dirkpetersen/appmotel)
conventions:

- `.env.example` — copy to `.env` and set `PORT` (appmotel sets this itself on deploy)
- `install.sh` — installs dependencies
- `Procfile` — `web: python -m uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT` (`python -m` because appmotel only puts the venv python, not `.venv/bin`, on the path)
- `GET /health` — health check endpoint

Deploy with `appmo add storage-finder <repo-url> main`.

## Layout

- `backend/app/data.py` — data classification levels and the storage option catalog
- `backend/app/engine.py` — scoring/recommendation logic
- `backend/app/main.py` — FastAPI app (serves the API and the static frontend)
- `frontend/` — landing page, `simple.*`, `wizard.*`, shared `common.js`/`style.css` (plain HTML/CSS/JS, no build step)

`POST /api/filter` returns the services that fit a partial set of answers plus, for every tile, how many services would remain if it were chosen. Tiles with zero are grayed out in both tools.
