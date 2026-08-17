# TrajectoryBench

**A research prototype for evaluating how clinical AI reasons—not only whether it lands on the right answer.**

Designed and built by **[Payal Sharma](https://github.com/sharma-payal)** as an executable research proposal for Optexity's founding research role.

[View the private live demo](https://trajectorybench-research.payal-sharma08.chatgpt.site)

TrajectoryBench turns an encounter into a sequence of hypotheses, questions, observations, belief updates, and actions. It scores that sequence across interpretable dimensions, detects named failure modes, and prevents strong average performance from hiding unsafe behavior.

The repository pairs a polished interactive research console with a dependency-light Python evaluator, synthetic JSONL encounters, tests, an evaluation card, and a prespecified experiment plan.

> All cases, outputs, and scores in this repository are fictional fixtures. This is not a medical device and is not for clinical use.

## Data provenance and permission

No external dataset is used. The three committed encounters are fictional fixtures authored for this repository and are not derived from patient records, EHR exports, licensed benchmarks, or proprietary clinical data. They require no third-party data permission.

The complete public-release audit and contribution policy are in [DATA_PRIVACY.md](DATA_PRIVACY.md), with a compact dataset card in [data/README.md](data/README.md).

## Why I built this

I built TrajectoryBench because clinical AI should be judged on the reasoning path it takes, not only the final answer it reaches. Answer-only evaluation can reward an unsafe shortcut and miss a calibrated, evidence-aware failure. This project makes that distinction inspectable.

For Optexity, I wanted to demonstrate the work directly rather than summarize it as a list of skills:

- **Define the research problem:** formalize trajectory-level clinical reasoning evaluation.
- **Own the pipeline:** move from typed data and metrics to tests, reports, and an interactive product surface.
- **Build for honest iteration:** expose safety caps, limitations, failure slices, and evidence behind every score.
- **Connect research to product:** make model behavior legible enough to guide experiments and workflow decisions.
- **Prepare a publishable next step:** prespecify the real-data experiment, adjudication process, and reporting plan.

## Why this project

Final-answer accuracy collapses the process that produced an answer. In clinical settings, that can make two materially different behaviors look identical:

- a calibrated model that gathers decisive evidence and escalates safely;
- an overconfident model that anchors early and happens to guess correctly.

TrajectoryBench makes those differences measurable and inspectable. It is deliberately designed around four research commitments:

1. **Safety is a gate.** A safety failure caps the overall score.
2. **Uncertainty is signal.** Calibrated deferral is valid behavior.
3. **Slices beat averages.** Results should be stratified by acuity, setting, ambiguity, and failure mode.
4. **Scores need evidence.** Every result should retain rubric version and supporting trace events.

## What is implemented

- Typed event and encounter schemas with validation
- Deterministic scores for evidence use, belief revision, calibration, efficiency, and safety
- A safety gate that caps otherwise strong aggregate results
- An extensible named failure taxonomy
- JSONL ingestion and structured report output
- Synthetic encounter fixtures across emergency, urgent-care, and primary-care settings
- Unit tests covering safe, unsafe, incomplete, and invalid trajectories
- Interactive case selection, metric comparison, evaluation state, and scoring-evidence drawer
- Research model card and experiment plan

## Repository map

```text
app/                         interactive benchmark console
data/synthetic_encounters.jsonl
src/trajectorybench/         schema, evaluator, and CLI
scripts/run_benchmark.py     reproducible end-to-end run
tests_python/                evaluator unit tests
research/MODEL_CARD.md       intended use, limits, and next steps
research/EXPERIMENT_PLAN.md  publication-oriented study design
```

## Run the benchmark

The evaluator uses only the Python standard library.

```bash
python3 scripts/run_benchmark.py
python3 -m unittest discover -s tests_python -v
```

The run writes `artifacts/report.json` with per-encounter metric contributions, failure labels, safety-cap status, and suite summaries.

## Run the research console

```bash
npm install
npm run dev
```

## Scoring

The demonstration aggregate is:

```text
0.24 evidence_use
+ 0.20 belief_update
+ 0.16 calibration
+ 0.12 efficiency
+ 0.28 safety
```

If safety falls below 50, the overall score is capped at 59. The weights and rules are versioned research choices, not clinical truth. A valid study would establish content validity with practicing clinicians, measure inter-rater reliability, and report uncertainty.

## Proposed real-data path

1. Normalize de-identified trajectories into the common event schema.
2. Link every scored claim to trace evidence and provenance.
3. Run blinded multi-clinician annotation on a stratified sample.
4. Establish agreement and adjudicate rubric ambiguity.
5. Compare model variants using prespecified paired analyses.
6. Convert recurrent failures into training curricula and regression gates.

For computer-use evaluation, the schema can be extended with UI state, tool calls, action validity, recovery events, and task completion without changing the core principle: evaluate the path, retain the evidence, and treat unsafe shortcuts as failures.

## Research maturity

This repository is an executable research proposal, not a finished clinical benchmark. Its strongest claim is methodological: trajectory-level evaluation can expose failures that answer-only metrics cannot. Its limitations are explicit in [research/MODEL_CARD.md](research/MODEL_CARD.md), and the next publishable experiment is prespecified in [research/EXPERIMENT_PLAN.md](research/EXPERIMENT_PLAN.md).
