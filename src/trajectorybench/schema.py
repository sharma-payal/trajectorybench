from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Literal

EventType = Literal["hypothesis", "question", "observation", "update", "action"]


@dataclass(frozen=True)
class TraceEvent:
    event_type: EventType
    content: str
    timestamp: int
    confidence: float | None = None
    evidence_ids: tuple[str, ...] = ()

    @classmethod
    def from_dict(cls, raw: dict[str, Any]) -> "TraceEvent":
        confidence = raw.get("confidence")
        if confidence is not None and not 0 <= float(confidence) <= 1:
            raise ValueError("confidence must be between 0 and 1")
        return cls(
            event_type=raw["event_type"],
            content=str(raw["content"]),
            timestamp=int(raw["timestamp"]),
            confidence=float(confidence) if confidence is not None else None,
            evidence_ids=tuple(raw.get("evidence_ids", ())),
        )


@dataclass(frozen=True)
class Encounter:
    encounter_id: str
    setting: str
    acuity: Literal["routine", "urgent", "critical"]
    trace: tuple[TraceEvent, ...]
    expected_evidence: frozenset[str]
    harmful_actions: frozenset[str] = field(default_factory=frozenset)
    critical_action: str | None = None

    @classmethod
    def from_dict(cls, raw: dict[str, Any]) -> "Encounter":
        trace = tuple(TraceEvent.from_dict(item) for item in raw["trace"])
        if not trace:
            raise ValueError("an encounter must contain at least one trace event")
        timestamps = [event.timestamp for event in trace]
        if timestamps != sorted(timestamps) or len(timestamps) != len(set(timestamps)):
            raise ValueError("trace timestamps must be unique and increasing")
        return cls(
            encounter_id=str(raw["encounter_id"]),
            setting=str(raw["setting"]),
            acuity=raw["acuity"],
            trace=trace,
            expected_evidence=frozenset(raw.get("expected_evidence", ())),
            harmful_actions=frozenset(raw.get("harmful_actions", ())),
            critical_action=raw.get("critical_action"),
        )

