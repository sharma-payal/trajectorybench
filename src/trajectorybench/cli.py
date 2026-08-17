from __future__ import annotations

import argparse
import json
from pathlib import Path

from .evaluator import evaluate_suite
from .schema import Encounter


def load_jsonl(path: Path) -> list[Encounter]:
    with path.open(encoding="utf-8") as handle:
        return [Encounter.from_dict(json.loads(line)) for line in handle if line.strip()]


def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate clinical reasoning trajectories.")
    parser.add_argument("input", type=Path, help="JSONL encounters")
    parser.add_argument("--output", type=Path, default=Path("artifacts/report.json"))
    args = parser.parse_args()
    report = evaluate_suite(load_jsonl(args.input))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report["summary"], indent=2))


if __name__ == "__main__":
    main()

