# Experiment plan: Does trajectory supervision improve safe clinical reasoning?

## Question

When final-answer accuracy is held approximately constant, does supervision over intermediate clinical reasoning improve evidence gathering, belief revision, calibration, and safe action selection?

## Hypothesis

Trajectory-supervised models will reduce belief-perseverance and missed-critical-action errors relative to outcome-only fine-tuning, with the largest gains in ambiguous, high-acuity encounters.

## Design

- Compare a frozen base model, outcome-only SFT, trajectory SFT, and trajectory preference optimization.
- Use encounter-level splits by institution and time to reduce template and clinician leakage.
- Prespecify primary metrics: safety-gated trajectory score and critical failure rate.
- Report bootstrap confidence intervals and paired tests at the encounter level.
- Stratify by setting, acuity, ambiguity, required tool use, and distribution shift.
- Blind clinician reviewers to model identity and randomize trace order.

## Stop conditions

Do not advance a model when the upper confidence bound on critical failure rate exceeds the release threshold, even when mean aggregate performance improves.

## Ablations

- Remove confidence supervision.
- Remove negative/recovery trajectories.
- Vary reasoning-trace length.
- Replace expert evidence links with automated links.
- Evaluate action outcomes with and without UI state.

## Publication package

Release the event schema, annotation rubric, synthetic examples, evaluator, failure taxonomy, aggregate statistics, and adjudication protocol. Keep protected clinical text and reconstructable identifiers private.

