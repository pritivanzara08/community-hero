# Community Hero

Community Hero is a hyperlocal civic issue reporting platform. Citizens can report problems like potholes, water leakage, waste issues, and broken streetlights. The platform helps the community verify issues, track progress, and view impact through dashboards.

## Current Progress

- Backend API is built with FastAPI.
- User registration and login are available.
- Citizens can report issues.
- Basic AI category suggestion is available using keywords.
- Citizens can verify issues and add comments.
- Admin can update issue status.
- Dashboard shows issue counts, category summary, and hotspots.
- Frontend pages are created and connected to the backend.

## Project Structure

```text
community-hero/
  backend/
    app/
      main.py
      models.py
      schemas.py
      routes/
    requirements.txt
    .env
    venv/
  frontend/
    index.html
    report.html
    dashboard.html
    admin.html
    script.js
    style.css
```

## Run Backend

Open terminal in the project folder:

```bash
cd backend
```

Activate virtual environment.

For Git Bash:

```bash
source venv/Scripts/activate
```

For PowerShell:

```powershell
.\venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start backend:

```bash
python -m uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

API docs:

```text
http://127.0.0.1:8000/docs
```

## Run Frontend

Open a second terminal:

```bash
cd frontend
python -m http.server 5500
```

Frontend URL:

```text
http://127.0.0.1:5500/index.html
```

## Demo Flow

1. Open the frontend.
2. Register a citizen account.
3. Login with that account.
4. Go to Report and submit a civic issue.
5. Verify an issue from the issue list.
6. Add a comment.
7. Open Dashboard to view impact stats.
8. Open Admin to update issue status.

## Next Development Steps

1. Add image and video upload to issue reports.
2. Show issues on a real map using latitude and longitude.
3. Add real authentication tokens instead of local browser storage.
4. Improve AI categorization and add priority prediction.
5. Add department assignment.
6. Add leaderboard and reward history.
7. Add filters for category, status, and location.
8. Add seed data for hackathon demo.

## Important Notes

- Keep `backend/.env` private because it contains database configuration.
- Start the backend before opening frontend pages.
- If port `8000` is already in use, the backend may already be running.
- If frontend API calls fail, check that the backend is running at `http://127.0.0.1:8000`.
