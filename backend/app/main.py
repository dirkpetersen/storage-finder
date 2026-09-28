import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from .data import CLASSIFICATIONS, STORAGE_OPTIONS
from .engine import recommend
from .schemas import QuestionnaireAnswers, RecommendationResponse

app = FastAPI(title="University Storage Finder", version="1.0.0")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/options")
def get_options():
    return STORAGE_OPTIONS


@app.get("/api/classifications")
def get_classifications():
    return CLASSIFICATIONS


@app.post("/api/recommend", response_model=RecommendationResponse)
def post_recommend(answers: QuestionnaireAnswers):
    return recommend(answers)


FRONTEND_DIR = Path(__file__).resolve().parents[2] / "frontend"
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
