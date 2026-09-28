import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .data import CLASSIFICATION_MATRIX, CLASSIFICATIONS, STORAGE_OPTIONS
from .engine import filter_options, recommend
from .schemas import (
    FilterResponse,
    PartialAnswers,
    QuestionnaireAnswers,
    RecommendationResponse,
    StorageOption,
)

app = FastAPI(title="University Storage Finder", version="1.0.0")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/options", response_model=list[StorageOption])
def get_options():
    return STORAGE_OPTIONS


@app.get("/api/classifications")
def get_classifications():
    return CLASSIFICATIONS


@app.get("/api/matrix")
def get_matrix():
    return CLASSIFICATION_MATRIX


@app.post("/api/recommend", response_model=RecommendationResponse)
def post_recommend(answers: QuestionnaireAnswers):
    return recommend(answers)


@app.post("/api/filter", response_model=FilterResponse)
def post_filter(answers: PartialAnswers):
    return filter_options(answers)


FRONTEND_DIR = Path(__file__).resolve().parents[2] / "frontend"


def _page(name: str):
    return lambda: FileResponse(FRONTEND_DIR / name)


for route, page in (("/", "index.html"), ("/simple", "simple.html"), ("/wizard", "wizard.html")):
    app.add_api_route(route, _page(page), include_in_schema=False)

app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
