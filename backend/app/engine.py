from .data import STORAGE_OPTIONS
from .schemas import QuestionnaireAnswers, Recommendation, RecommendationResponse

VOLUME_LABELS = {
    "small": "under 25 GB",
    "medium": "25 GB to 1 TB",
    "large": "1 TB to 5 TB",
    "xlarge": "over 5 TB",
}
PURPOSE_LABELS = {
    "everyday": "everyday files and documents",
    "hpc": "active research computing",
    "archive": "long-term archival",
}
AUDIENCE_LABELS = {
    "individual": "just you",
    "team": "your team",
    "external": "external collaborators",
}


def recommend(answers: QuestionnaireAnswers) -> RecommendationResponse:
    scored: list[Recommendation] = []
    excluded_count = 0

    for option in STORAGE_OPTIONS:
        if option["department_restricted"] and option["department_restricted"] != answers.department:
            excluded_count += 1
            continue

        classification_status = option["classification_status"][answers.classification]
        if classification_status == "no":
            excluded_count += 1
            continue

        score = 0
        reasons: list[str] = []
        warnings: list[str] = []

        if classification_status == "ok":
            score += 30
            reasons.append(f"Approved for {answers.classification} data.")
        else:
            score += 15
            warnings.append(
                f"{option['short_name']} allows {answers.classification} data, but requires IT "
                "security review/approval first."
            )

        if answers.audience in option["audiences"]:
            score += 20
            reasons.append(f"Supports sharing with {AUDIENCE_LABELS[answers.audience]}.")
        else:
            score += 5
            warnings.append(f"Not ideal for sharing with {AUDIENCE_LABELS[answers.audience]}.")

        if answers.volume in option["volumes"]:
            score += 20
            reasons.append(f"Sized well for {VOLUME_LABELS[answers.volume]} of data.")
        else:
            score += 5
            warnings.append(f"Not the best fit for {VOLUME_LABELS[answers.volume]} of data.")

        if answers.backup == "auto":
            if option["backup_available"]:
                score += 15
                reasons.append("Includes automatic backup.")
            else:
                score += 5
                warnings.append("No automatic backup — " + option["backup_note"])
        else:
            score += 15

        if answers.purpose in option["purposes"]:
            score += 15
            reasons.append(f"Well suited to {PURPOSE_LABELS[answers.purpose]}.")
        else:
            score += 5

        scored.append(
            Recommendation(option=option, score=score, reasons=reasons, warnings=warnings)
        )

    scored.sort(key=lambda r: (-r.score, len(r.warnings)))
    return RecommendationResponse(recommendations=scored, excluded_count=excluded_count)
