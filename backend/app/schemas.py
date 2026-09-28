from typing import Literal

from pydantic import BaseModel, Field

Cost = Literal["quota", "paid", "either"]
Classification = Literal["unrestricted", "sensitive", "confidential"]
Audience = Literal["individual", "team", "external"]
DataVolume = Literal["small", "medium", "large", "xlarge"]
BackupNeed = Literal["auto", "none"]
Purpose = Literal["everyday", "hpc", "archive"]


class QuestionnaireAnswers(BaseModel):
    classification: Classification
    audience: Audience
    volume: DataVolume
    backup: BackupNeed
    purpose: Purpose
    cost: Cost


class PartialAnswers(BaseModel):
    classification: Classification | None = None
    audience: Audience | None = None
    volume: DataVolume | None = None
    backup: BackupNeed | None = None
    purpose: Purpose | None = None
    cost: Cost | None = None


class StorageOption(BaseModel):
    id: str
    name: str
    short_name: str
    vendor: str
    category: str
    kind: Literal["storage", "application"] = "storage"
    specialty: str | None = None
    review_note: str | None = None
    eligibility: str | None = None
    how_to: str | None = None
    tagline: str
    description: str
    cost: str
    capacity_label: str
    backup_available: bool
    backup_note: str
    pricing: Literal["quota", "paid", "both"]
    classification_status: dict[Classification, Literal["ok", "review", "no"]]
    audiences: list[Audience]
    volumes: list[DataVolume]
    purposes: list[Purpose]
    pros: list[str]
    cons: list[str]
    accent: str


class Recommendation(BaseModel):
    option: StorageOption
    score: int
    reasons: list[str]
    warnings: list[str]


class RecommendationResponse(BaseModel):
    recommendations: list[Recommendation]
    excluded_count: int


class FilterResponse(BaseModel):
    matches: list[StorageOption]
    availability: dict[str, dict[str, int]]
