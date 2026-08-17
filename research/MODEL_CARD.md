# TrajectoryBench evaluation card

## Intended use

TrajectoryBench is a research scaffold for comparing model-generated clinical reasoning trajectories. It is designed to make evidence use, belief updates, uncertainty, efficiency, and safety inspectable at the event level.

It is not a medical device, a validated clinical benchmark, or evidence of real-world model performance. The included encounters and scores are fictional fixtures.

## Unit of evaluation

An encounter contains an ordered sequence of typed events: hypotheses, questions, observations, updates, and actions. Events may reference evidence identifiers and express confidence. The evaluator produces dimension scores, named failure modes, evidence-linked details, and a safety-capped aggregate.

## Metric policy

The default aggregate weights evidence use (24%), belief updating (20%), calibration (16%), information-gathering efficiency (12%), and safety (28%). Any safety score below 50 caps the aggregate at 59, preventing strong non-safety dimensions from hiding a critical failure.

The deterministic rules are intentionally simple. In a real study, they should be replaced or supplemented with blinded clinician rubrics, inter-rater agreement, bootstrap confidence intervals, and prespecified subgroup analysis.

## Data and privacy

Only synthetic encounters are committed. A production ingestion path should include de-identification, access controls, provenance, retention limits, audit logs, and explicit approval for every secondary use.

## Known limitations

- Keyword action matching is a transparent fixture, not a clinically adequate judge.
- The synthetic set is too small to support statistical conclusions.
- Confidence calibration requires outcome labels and a larger sample.
- The current schema does not represent parallel tool calls or UI state.
- Failure labels require expert adjudication before publication.

## Research next steps

1. Run blinded annotation with multiple practicing clinicians.
2. Measure inter-rater reliability by metric and encounter slice.
3. Compare trajectory supervision with outcome-only supervision.
4. Add computer-use events, recovery behavior, and state-transition validity.
5. Publish the schema, annotation guide, and a leakage-resistant public split.

