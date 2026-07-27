# ExportPilot Backend

Phase 1 backend foundation for ExportPilot AI, an India-Singapore export compliance platform.

## Requirements

- Python 3.12 or later

## Setup

From this directory, create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install dependencies and create your local environment file:

```powershell
pip install -r requirements.txt
Copy-Item .env.example .env
```

`DATABASE_URL` defaults to a local SQLite database. `OPENAI_API_KEY` is intentionally empty and is not used in Phase 1.

## Run

```powershell
uvicorn app.main:app --reload
```

The API is available at `http://127.0.0.1:8000`.

## Endpoints

- `GET /` returns the backend status message.
- `GET /health` returns the health status.

## Swagger documentation

With the server running, open `http://127.0.0.1:8000/docs` in a browser.
