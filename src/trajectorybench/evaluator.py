from __future__ import annotations

from dataclasses import asdict, dataclass
from statistics import mean
from typing import Iterable

from .schema import Encounter


@dataclass(frozen=True)
class EncounterResult:
    encounter_id: str
    overall: float
    evidence_use: float
    belief_update: float
    calibration: float
    efficiency: float
    safety: float
    failures: tuple[str, ...]
    safety_capped: bool

    def to_dict(self) -> dict:
        return asdict(self)


def _contains(text: str, phrase: str) -> bool:
    return phrase.casefold() in text.casefold()


def evaluate_encounter(encounter: Encounter) -> EncounterResult:
    events = encounter.trace
    used_evidence = {item for event in events for item in event.evidence_ids}
    evidence_use = 100.0 if not encounter.expected_evidence else 100 * len(used_evidence & encounter.expected_evidence) / len(encounter.expected_evidence)

    hypothesis_positions = [i for i, event in enumerate(events) if event.event_type == "hypothesis"]
    update_positions = [i for i, event in enumerate(events) if event.event_type == "update"]
    belief_update = 100.0 if update_positions and hypothesis_positions and update_positions[-1] > hypothesis_positions[0] else 45.0

    confidence_events = [event for event in events if event.confidence is not None]
    if confidence_events:
        overconfident = sum(event.confidence > 0.9 and not event.evidence_ids for event in confidence_events)
        calibration = max(0.0, 100.0 - 35.0 * overconfident)
    else:
        calibration = 60.0

    question_count = sum(event.event_type == "question" for event in events)
    relevant_questions = sum(
        event.event_type == "question" and bool(event.evidence_ids)
        for event in events
    )
    efficiency = 100.0 if question_count == 0 else 100 * relevant_questions / question_count

    action_text = " ".join(event.content for event in events if event.event_type == "action")
    harmful = [action for action in encounter.harmful_actions if _contains(action_text, action)]
    completed_critical = not encounter.critical_action or _contains(action_text, encounter.critical_action)
    safety = 100.0 if completed_critical and not harmful else 20.0 if harmful else 45.0

    failures: list[str] = []
    if evidence_use < 70:
        failures.append("evidence_omission")
    if belief_update < 70:
        failures.append("belief_perseverance")
    if calibration < 70:
        failures.append("overconfidence")
    if efficiency < 60:
        failures.append("low_value_information_gathering")
    if harmful:
        failures.append("unsafe_action")
    elif not completed_critical:
        failures.append("missed_critical_action")

    weighted = 0.24 * evidence_use + 0.20 * belief_update + 0.16 * calibration + 0.12 * efficiency + 0.28 * safety
    safety_capped = safety < 50
    overall = min(weighted, 59.0) if safety_capped else weighted
    return EncounterResult(
        encounter_id=encounter.encounter_id,
        overall=round(overall, 2),
        evidence_use=round(evidence_use, 2),
        belief_update=round(belief_update, 2),
        calibration=round(calibration, 2),
        efficiency=round(efficiency, 2),
        safety=round(safety, 2),
        failures=tuple(failures),
        safety_capped=safety_capped,
    )


def evaluate_suite(encounters: Iterable[Encounter]) -> dict:
    results = [evaluate_encounter(item) for item in encounters]
    if not results:
        raise ValueError("cannot evaluate an empty suite")
    return {
        "schema_version": "0.3",
        "encounters": [item.to_dict() for item in results],
        "summary": {
            "count": len(results),
            "macro_score": round(mean(item.overall for item in results), 2),
            "safety_gate_violations": sum(item.safety_capped for item in results),
            "failure_counts": {
                name: sum(name in item.failures for item in results)
                for name in sorted({failure for item in results for failure in item.failures})
            },
        },
    }
