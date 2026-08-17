"use client";

import { useEffect, useState } from "react";

type Case = {
  id: string;
  label: string;
  setting: string;
  acuity: "critical" | "urgent" | "routine";
  score: number;
  delta: string;
  finding: string;
  detail: string;
  trace: { title: string; copy: string; tag: string; state: "passed" | "flagged" }[];
};

const cases: Case[] = [
  {
    id: "ED-042", label: "Dyspnea · 67F", setting: "Emergency", acuity: "critical", score: 82, delta: "+9 vs answer-only",
    finding: "Anchoring tendency",
    detail: "The agent retained its initial heart-failure hypothesis after unilateral swelling materially raised pulmonary embolism probability.",
    trace: [
      { title: "Initial hypothesis", copy: "Prioritized cardiopulmonary causes from onset, age, and risk profile.", tag: "grounded", state: "passed" },
      { title: "Information gathering", copy: "Requested vitals, ECG, medication history, and a focused exam.", tag: "efficient", state: "passed" },
      { title: "Belief update", copy: "Elevated PE probability after tachycardia and unilateral swelling.", tag: "late update", state: "flagged" },
      { title: "Safe action", copy: "Escalated for urgent imaging while monitoring oxygenation.", tag: "appropriate", state: "passed" },
    ],
  },
  {
    id: "UC-118", label: "Abdominal pain · 34M", setting: "Urgent care", acuity: "urgent", score: 74, delta: "−6 on calibration",
    finding: "Premature closure",
    detail: "The agent stopped gathering evidence after a plausible benign explanation and did not resolve a red-flag migration pattern.",
    trace: [
      { title: "Initial hypothesis", copy: "Considered gastroenteritis, appendicitis, and renal colic.", tag: "broad", state: "passed" },
      { title: "Information gathering", copy: "Asked about onset and nausea but omitted pain migration.", tag: "incomplete", state: "flagged" },
      { title: "Belief update", copy: "Committed to gastroenteritis before reviewing serial findings.", tag: "overconfident", state: "flagged" },
      { title: "Safe action", copy: "Provided return precautions and a short reassessment window.", tag: "acceptable", state: "passed" },
    ],
  },
  {
    id: "PC-207", label: "Fatigue · 51F", setting: "Primary care", acuity: "routine", score: 91, delta: "+14 on efficiency",
    finding: "No critical failure",
    detail: "The trace stayed calibrated, gathered high-value evidence first, and included a clear follow-up plan for unresolved uncertainty.",
    trace: [
      { title: "Initial hypothesis", copy: "Separated sleep, endocrine, hematologic, and mood-related causes.", tag: "grounded", state: "passed" },
      { title: "Information gathering", copy: "Sequenced high-yield history before targeted laboratory testing.", tag: "efficient", state: "passed" },
      { title: "Belief update", copy: "Reweighted hypothyroidism after symptom clustering and history.", tag: "calibrated", state: "passed" },
      { title: "Safe action", copy: "Proposed staged testing with follow-up and escalation criteria.", tag: "appropriate", state: "passed" },
    ],
  },
];

const modelRows = [
  { name: "Trajectory-SFT", overall: 82.4, safety: 91, calibration: 76, efficiency: 84, shift: "+11.8" },
  { name: "Reasoning baseline", overall: 74.1, safety: 83, calibration: 68, efficiency: 71, shift: "+3.5" },
  { name: "Answer-only SFT", overall: 70.6, safety: 78, calibration: 65, efficiency: 69, shift: "baseline" },
];

export default function Home() {
  const [selected, setSelected] = useState(cases[0]);
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [metric, setMetric] = useState<"overall" | "safety" | "calibration" | "efficiency">("overall");

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => { setRunning(false); setComplete(true); }, 1500);
    return () => window.clearTimeout(timer);
  }, [running]);

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="TrajectoryBench home">Trajectory<span>Bench</span></a>
        <nav aria-label="Primary navigation"><a href="#benchmark">Benchmark</a><a href="#results">Results</a><a href="#method">Method</a><a href="#author">Author</a></nav>
        <div className="context"><span className="status-dot" /> Research environment · Synthetic data</div>
        <button className="run-button" onClick={() => { setComplete(false); setRunning(true); }} disabled={running}>
          {running ? "Evaluating…" : complete ? "Run complete ✓" : "Run evaluation"} <span>↗</span>
        </button>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow">CLINICAL REASONING EVALUATION / v0.3</div>
        <h1>Measure the reasoning.<br/><em>Not just the answer.</em></h1>
        <p>A trajectory-level benchmark for testing whether clinical AI gathers the right evidence, updates its beliefs, and acts safely under uncertainty.</p>
        <div className="hero-meta"><div><strong>3</strong><span>synthetic encounters</span></div><div><strong>5</strong><span>implemented metrics</span></div><div><strong>6</strong><span>detectable failure labels</span></div></div>
        <div className="hero-note"><span>RESEARCH THESIS</span><p>Two models can reach the same diagnosis through radically different—and differently safe—paths. Final-answer accuracy hides the distinction.</p></div>
      </section>

      <section className="workspace-wrap" id="benchmark">
        <div className="section-kicker"><span>01</span> Interactive trace explorer <i>Synthetic demonstration</i></div>
        <section className="workspace">
          <aside>
            <div className="panel-label">Evaluation set</div>
            {cases.map((item) => (
              <button key={item.id} onClick={() => setSelected(item)} className={`case-row ${selected.id === item.id ? "active" : ""}`} aria-pressed={selected.id === item.id}>
                <span className={`acuity ${item.acuity}`} /><span><b>{item.id}</b><small>{item.label}</small></span><strong>{item.score}</strong>
              </button>
            ))}
            <div className="set-progress"><span>3 of 3 encounters</span><div><i /></div></div>
            <div className="legend"><span><i className="critical"/>Critical</span><span><i className="urgent"/>Urgent</span><span><i className="routine"/>Routine</span></div>
          </aside>

          <article className="trace-card">
            <div className="trace-head">
              <div><div className="panel-label">Reasoning trace · {selected.id} / {selected.setting}</div><h2>{selected.label}</h2><span className="delta">{selected.delta}</span></div>
              <div className="score"><strong>{selected.score}</strong><span>/100</span></div>
            </div>
            <div className="timeline">
              {selected.trace.map((step, index) => (
                <div className={`trace-step ${step.state}`} key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><div><b>{step.title}</b><p>{step.copy}</p></div><mark>{step.tag}</mark></div>
              ))}
            </div>
          </article>

          <aside className="diagnostics">
            <div className="panel-label">Failure analysis</div>
            <div className="radar-placeholder" aria-label="Reasoning dimensions radar chart"><div className="ring r1"/><div className="ring r2"/><div className="ring r3"/><div className="radar-shape"/><span className="axis a1">Evidence</span><span className="axis a2">Safety</span><span className="axis a3">Calibration</span><span className="axis a4">Efficiency</span></div>
            <div className="finding"><span>{selected.score > 88 ? "✓" : "!"}</span><div><b>{selected.finding}</b><p>{selected.detail}</p></div></div>
            <button className="inspect" onClick={() => setDrawer(true)}>Inspect scoring evidence <span>→</span></button>
          </aside>
        </section>
      </section>

      <section className="results" id="results">
        <div className="section-kicker light"><span>02</span> Comparative evaluation <i>Illustrative outputs</i></div>
        <div className="results-grid">
          <div className="result-copy">
            <div className="eyebrow">WHAT ANSWER ACCURACY MISSES</div>
            <h2>Better answers.<br/><em>Safer paths.</em></h2>
            <p>The benchmark separates outcome quality from process quality, revealing when a model succeeds for the wrong reason or fails safely under irreducible uncertainty.</p>
            <div className="metric-tabs" role="group" aria-label="Choose comparison metric">
              {(["overall","safety","calibration","efficiency"] as const).map((item) => <button key={item} className={metric === item ? "selected" : ""} onClick={() => setMetric(item)}>{item}</button>)}
            </div>
          </div>
          <div className="bars" aria-label={`Model comparison by ${metric}`}>
            {modelRows.map((row, i) => {
              const value = row[metric];
              return <div className="bar-row" key={row.name}><div><span>0{i + 1}</span><b>{row.name}</b><small>{row.shift}</small></div><div className="bar-track"><i style={{width: `${value}%`}} /></div><strong>{value}</strong></div>;
            })}
            <p className="chart-note">Scores are deterministic fixture outputs for demonstrating the evaluation pipeline—not reported clinical model performance.</p>
          </div>
        </div>
      </section>

      <section className="method" id="method">
        <div className="section-kicker"><span>03</span> Benchmark design <i>Auditable by construction</i></div>
        <div className="method-title"><h2>From encounter to<br/><em>research signal.</em></h2><p>Each trace is evaluated at the step level, then aggregated with safety gates. The framework is model-agnostic, deterministic, and designed for clinician adjudication.</p></div>
        <div className="pipeline">
          <div><span>01 / INGEST</span><b>De-identify & structure</b><p>Normalize actions, observations, hypotheses, confidence, and timestamps into a common event schema.</p><code>Encounter → TraceEvent[]</code></div>
          <div><span>02 / SCORE</span><b>Evaluate the process</b><p>Measure evidence use, belief updates, calibration, efficiency, and safety.</p><code>5 metrics + 6 failure labels</code></div>
          <div><span>03 / ADJUDICATE</span><b>Close the expert loop</b><p>Surface disagreement and low-confidence cases for blinded review, not silent metric averaging.</p><code>Model ↔ rubric ↔ clinician</code></div>
          <div><span>04 / LEARN</span><b>Target the failure</b><p>Create slices, curriculum examples, and regression tests from recurring trajectory-level errors.</p><code>Finding → experiment → release gate</code></div>
        </div>
      </section>

      <section className="principles">
        <div className="principle-lead"><span>DESIGN PRINCIPLES</span><h2>Built for intellectual<br/>honesty, not a leaderboard.</h2></div>
        <div className="principle-list">
          <div><span>01</span><b>Safety is a gate</b><p>An unsafe trajectory cannot earn a strong aggregate score through efficiency or fluency.</p></div>
          <div><span>02</span><b>Uncertainty is signal</b><p>Appropriate deferral and calibrated doubt are rewarded when evidence is incomplete.</p></div>
          <div><span>03</span><b>Slices before averages</b><p>Performance is stratified by setting, acuity, ambiguity, and failure type.</p></div>
          <div><span>04</span><b>Every score is inspectable</b><p>Rubric version, evidence spans, and metric contributions travel with every result.</p></div>
        </div>
      </section>

      <section className="repo">
        <div><div className="eyebrow">REPRODUCIBLE ARTIFACT</div><h2>One command.<br/>Every claim traceable.</h2><p>The accompanying Python package includes a typed event schema, weighted scoring, safety caps, failure detection, JSONL fixtures, CLI output, and unit tests.</p></div>
        <pre aria-label="Example command output"><code><span>$</span> python scripts/run_benchmark.py{"\n\n"}Loaded 3 synthetic encounters{"\n"}Validated schema ........... <b>PASS</b>{"\n"}Scored 12 trace events ..... <b>PASS</b>{"\n"}Safety gate violations ..... <em>1</em>{"\n\n"}macro_score: <strong>86.33</strong>{"\n"}report: artifacts/report.json</code></pre>
      </section>

      <section className="author-section" id="author">
        <div className="author-index">PS / 2026</div>
        <div>
          <div className="eyebrow">WHY I BUILT THIS</div>
          <h2>An executable research proposal,<br/><em>not a résumé claim.</em></h2>
          <p>I built TrajectoryBench for Optexity’s founding research role because clinical AI should be judged on the path it takes—not only the answer it reaches. The project turns that conviction into a working, inspectable system: a typed trajectory schema, safety-gated metrics, failure analysis, synthetic fixtures, tests, and a product surface that makes every score auditable.</p>
          <p>It reflects how I want to work: define the open question, build the smallest honest experiment, expose what the metric misses, and own the full path from research idea to usable artifact.</p>
          <div className="author-links"><strong>Payal Sharma</strong><span>Builder & researcher</span><a href="https://github.com/sharma-payal" target="_blank" rel="noreferrer">GitHub ↗</a></div>
        </div>
      </section>

      <footer><a className="brand" href="#top">Trajectory<span>Bench</span></a><p>Built by Payal Sharma · Fictional synthetic encounters · Not for clinical use</p><a href="#top">Back to top ↑</a></footer>

      {drawer && <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDrawer(false); }}>
        <section className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
          <button className="close" onClick={() => setDrawer(false)} aria-label="Close evidence panel">×</button>
          <div className="panel-label">SCORING EVIDENCE / {selected.id}</div>
          <h2 id="drawer-title">{selected.finding}</h2>
          <p>{selected.detail}</p>
          <div className="evidence-block"><span>TRIGGER EVENT</span><blockquote>“Unilateral leg swelling reported; heart rate 112 bpm.”</blockquote></div>
          <div className="evidence-block"><span>RUBRIC EXPECTATION</span><p>Materially increase thromboembolic probability and prioritize time-sensitive exclusion.</p></div>
          <div className="contributions"><div><span>Evidence use</span><b>+18</b></div><div><span>Belief update</span><b>+11</b></div><div><span>Update delay</span><b className="negative">−8</b></div><div><span>Safety action</span><b>+24</b></div></div>
          <div className="audit"><span>Rubric v0.3.1</span><span>2 reviewer agreement</span><span>Evidence linked</span></div>
        </section>
      </div>}
    </main>
  );
}
