from typing import get_args

from .data import STORAGE_OPTIONS
from .schemas import (
    Audience,
    BackupNeed,
    Classification,
    DataVolume,
    Department,
    FilterResponse,
    PartialAnswers,
    Purpose,
    QuestionnaireAnswers,
    Recommendation,
    RecommendationResponse,
)

CHOICES = {
    "department": get_args(Department),
    "classification": get_args(Classification),
    "audience": get_args(Audience),
    "volume": get_args(DataVolume),
    "backup": get_args(BackupNeed),
    "purpose": get_args(Purpose),
}

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
            review = option.get("review_note") or "requires IT security review and approval"
            warnings.append(
                f"{option['short_name']} can hold {answers.classification} data, but {review} first."
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

        if option.get("kind") == "application":
            score -= 20
            warnings.append(f"Specialized service: {option['specialty']}.")

        scored.append(
            Recommendation(option=option, score=score, reasons=reasons, warnings=warnings)
        )

    scored.sort(key=lambda r: (-r.score, len(r.warnings)))
    return RecommendationResponse(recommendations=scored, excluded_count=excluded_count)


def fits(option: dict, answers: dict) -> bool:
    """True if the option satisfies every answer given (unanswered = no constraint)."""
    dept = answers.get("department")
    if dept and option["department_restricted"] and option["department_restricted"] != dept:
        return False
    cls = answers.get("classification")
    if cls and option["classification_status"][cls] == "no":
        return False
    if answers.get("audience") and answers["audience"] not in option["audiences"]:
        return False
    if answers.get("volume") and answers["volume"] not in option["volumes"]:
        return False
    if answers.get("backup") == "auto" and not option["backup_available"]:
        return False
    if answers.get("purpose") and answers["purpose"] not in option["purposes"]:
        return False
    return True


def filter_options(partial: PartialAnswers) -> FilterResponse:
    answers = {k: v for k, v in partial.model_dump().items() if v}
    matches = [o for o in STORAGE_OPTIONS if fits(o, answers)]
    availability = {
        key: {
            value: sum(fits(o, {**answers, key: value}) for o in STORAGE_OPTIONS)
            for value in values
        }
        for key, values in CHOICES.items()
    }
    return FilterResponse(matches=matches, availability=availability)
