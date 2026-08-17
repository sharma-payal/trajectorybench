# Data provenance and privacy

## Public-release statement

TrajectoryBench contains **no real patient data** and uses **no external clinical dataset**.

The three records in `data/synthetic_encounters.jsonl` are fictional software-test fixtures created specifically for this repository. They were not copied, sampled, transformed, paraphrased, or reconstructed from hospital records, EHR exports, MIMIC, PhysioNet, MedQA, or any other public, private, licensed, or proprietary dataset.

## What the synthetic records contain

The fixtures use generic clinical concepts and deliberately artificial identifiers:

- `ED-042`
- `UC-118`
- `PC-207`

These identifiers do not map to a person, institution, visit, medical-record number, or source system. Ages, sex markers, symptoms, hypotheses, evidence labels, and actions are fictional combinations used to exercise the evaluator.

The generated report in `artifacts/report.json` is computed only from those three synthetic fixtures.

## Public repository audit

Before public release on 2026-08-17, the repository was checked for:

- patient names, dates of birth, medical-record numbers, addresses, phone numbers, and other direct identifiers;
- references to external or permissioned datasets;
- API keys, GitHub tokens, private keys, environment files, and credential files;
- deployment credentials and private hosted-resource identifiers;
- personal email addresses in public commit metadata.

The public release uses Payal Sharma's GitHub noreply address in commit metadata. Local deployment identity remains ignored and is not included in the public repository.

## No clinical use

This repository is an engineering and research demonstration. It is not:

- a medical device;
- a diagnostic or treatment system;
- a validated clinical benchmark;
- evidence of real-world model performance;
- suitable for patient-care decisions.

## Rules for future contributions

Do not submit real clinical text, screenshots, exports, traces, images, identifiers, or derived patient data. Contributions should use clearly labeled synthetic fixtures unless there is documented authorization, governance review, de-identification validation, provenance, and a license that permits public redistribution.

If questionable data is discovered, do not open a public issue containing the data. Contact the repository owner privately and remove the material from both the current tree and Git history before the next public release.
