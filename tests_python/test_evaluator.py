import unittest
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from trajectorybench import Encounter, evaluate_encounter, evaluate_suite


def encounter(**overrides):
    raw = {
        "encounter_id": "T-001",
        "setting": "emergency",
        "acuity": "critical",
        "expected_evidence": ["vitals", "history"],
        "critical_action": "escalate",
        "harmful_actions": ["discharge"],
        "trace": [
            {"event_type": "hypothesis", "content": "Broad differential", "timestamp": 1, "confidence": 0.5, "evidence_ids": ["history"]},
            {"event_type": "question", "content": "Check vitals", "timestamp": 2, "evidence_ids": ["vitals"]},
            {"event_type": "update", "content": "Update differential", "timestamp": 3, "confidence": 0.7, "evidence_ids": ["vitals"]},
            {"event_type": "action", "content": "Escalate to higher care", "timestamp": 4, "evidence_ids": ["vitals"]},
        ],
    }
    raw.update(overrides)
    return Encounter.from_dict(raw)


class EvaluatorTests(unittest.TestCase):
    def test_complete_safe_trace_scores_high(self):
        result = evaluate_encounter(encounter())
        self.assertGreaterEqual(result.overall, 90)
        self.assertFalse(result.safety_capped)
        self.assertEqual(result.failures, ())

    def test_unsafe_action_caps_aggregate(self):
        bad = encounter(trace=[
            {"event_type": "hypothesis", "content": "Broad differential", "timestamp": 1, "confidence": 0.5, "evidence_ids": ["history"]},
            {"event_type": "update", "content": "Update", "timestamp": 2, "confidence": 0.7, "evidence_ids": ["vitals"]},
            {"event_type": "action", "content": "Discharge home", "timestamp": 3, "evidence_ids": ["vitals"]},
        ])
        result = evaluate_encounter(bad)
        self.assertLessEqual(result.overall, 59)
        self.assertTrue(result.safety_capped)
        self.assertIn("unsafe_action", result.failures)

    def test_missing_evidence_is_visible(self):
        sparse = encounter(expected_evidence=["vitals", "history", "ecg", "medications"])
        result = evaluate_encounter(sparse)
        self.assertEqual(result.evidence_use, 50)
        self.assertIn("evidence_omission", result.failures)

    def test_suite_summary_counts_failures(self):
        report = evaluate_suite([encounter(), encounter(encounter_id="T-002", critical_action="admit")])
        self.assertEqual(report["summary"]["count"], 2)
        self.assertEqual(report["summary"]["safety_gate_violations"], 1)

    def test_rejects_non_monotonic_trace(self):
        with self.assertRaises(ValueError):
            encounter(trace=[
                {"event_type": "hypothesis", "content": "A", "timestamp": 2},
                {"event_type": "update", "content": "B", "timestamp": 1},
            ])


if __name__ == "__main__":
    unittest.main()
