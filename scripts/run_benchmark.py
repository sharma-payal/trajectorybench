from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from trajectorybench.evaluator import evaluate_suite
from trajectorybench.schema import Encounter


def main() -> None:
    source = ROOT / "data" / "synthetic_encounters.jsonl"
    encounters = [
        Encounter.from_dict(json.loads(line))
        for line in source.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
    report = evaluate_suite(encounters)
    target = ROOT / "artifacts" / "report.json"
    target.parent.mkdir(exist_ok=True)
    target.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"Loaded {len(encounters)} synthetic encounters")
    print("Validated schema ........... PASS")
    print(f"Scored {sum(len(item.trace) for item in encounters)} trace events ..... PASS")
    print(f"Safety gate violations ..... {report['summary']['safety_gate_violations']}")
    print(f"\nmacro_score: {report['summary']['macro_score']}")
    print("report: artifacts/report.json")


if __name__ == "__main__":
    main()
