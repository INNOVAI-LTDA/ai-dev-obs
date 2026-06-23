# V0.2 — Cost Observability

## Status

Planned

---

# Objective

The goal of V0.2 is to introduce quantitative observability into AI-assisted development sessions.

While V0.1 focuses on recording what happened during a session, V0.2 focuses on measuring how much effort, interaction and computational consumption were required.

The primary question addressed by this version is:

> How much did it cost to complete a development activity using AI?

Cost in this context does not necessarily mean monetary cost.

It refers to the resources consumed during the session:

* Human effort
* AI effort
* Interaction cycles
* Context size
* Character volume
* Estimated token consumption
* Session duration

---

# Scope

V0.2 introduces:

* Cost Metrics
* Human Time Tracking
* AI Time Tracking
* Task Classification
* Complexity Classification
* Cost Reports
* Consolidated Reports
* Analytics Export

---

# Out of Scope

The following capabilities are intentionally excluded from V0.2:

* Real API billing integration
* Agent routing analysis
* Context source tracking
* Memory analysis
* Architecture analysis
* Dashboards
* Database persistence
* Multi-session analytics

These capabilities belong to future roadmap stages.

---

# Architectural Goal

The main architectural goal of V0.2 is to establish a reusable metrics collection layer.

Future roadmap versions should not calculate metrics independently.

Instead, all reports should consume a common Metrics Engine.

```text
Session
    │
    ▼
Metrics Engine
    │
    ├── Session Metrics
    ├── Cost Metrics
    ├── Context Metrics
    ├── Agent Metrics
    └── Research Metrics
```

V0.2 implements the first production version of this architecture.

---

# Session Model Changes

## New Session Fields

```json
{
  "taskType": "feature",
  "complexity": "low",
  "metrics": {
    "interactionCount": 0,
    "inputChars": 0,
    "outputChars": 0,
    "totalChars": 0,
    "estimatedInputTokens": 0,
    "estimatedOutputTokens": 0,
    "estimatedTotalTokens": 0,
    "humanActiveTimeMs": 0,
    "aiResponseTimeMs": 0,
    "totalSessionTimeMs": 0
  }
}
```

---

# New Metrics

## Interaction Count

Tracks the number of observable interactions between the user and the AI.

Used for:

* Session efficiency
* Cost analysis
* Benchmark comparison

---

## Character Metrics

Tracks:

* Input characters
* Output characters
* Total characters

Used for:

* Token estimation
* Context growth analysis
* Future ContextOps metrics

---

## Token Metrics

Estimated using:

```text
estimatedTokens = totalChars / 4
```

Tracked metrics:

* Estimated Input Tokens
* Estimated Output Tokens
* Estimated Total Tokens

Future versions may support model-specific tokenizers.

---

## Human Active Time

Measures active work performed by the human.

Tracked using:

```text
@obs /mark human-start
@obs /mark human-stop
```

Accumulated across the session.

---

## AI Response Time

Automatically measured.

Flow:

User Prompt
↓
Start Timer
↓
Model Processing
↓
Response Received
↓
Stop Timer

Accumulated throughout the session.

---

## Session Duration

Calculated as:

```text
sessionEndTime - sessionStartTime
```

---

# New Commands

## Task Classification

```text
@obs /task feature
@obs /task bug
@obs /task refactor
@obs /task docs
@obs /task research
@obs /task test
@obs /task architecture
```

Stored in:

```json
{
  "taskType": "feature"
}
```

---

## Complexity Classification

```text
@obs /complexity trivial
@obs /complexity low
@obs /complexity medium
@obs /complexity high
```

Stored in:

```json
{
  "complexity": "medium"
}
```

---

## Human Time Tracking

```text
@obs /mark human-start

@obs /mark human-stop
```

---

## Cost Report

```text
@obs /report cost
```

Generates:

```text
v0.2-cost-observability.md
```

---

## Consolidated Report

```text
@obs /report consolidated
```

Generates:

```text
consolidated-report.md
```

---

## Export

```text
@obs /export json

@obs /export csv

@obs /export all
```

---

# Generated Artifacts

## Cost Report

```text
reports/

v0.2-cost-observability.md
```

Purpose:

Human-readable analysis of cost-related metrics.

---

## Consolidated Report

```text
reports/

consolidated-report.md
```

Purpose:

Single report aggregating all available observability layers.

---

## Analytics JSON

```text
reports/

analytics.json
```

Purpose:

Machine-readable export.

Primary source for future dashboards.

---

## Analytics CSV

```text
reports/

analytics.csv
```

Purpose:

Import into:

* Excel
* Power BI
* DuckDB
* Python
* BI platforms

---

# Acceptance Criteria

V0.2 is considered complete when the following workflow succeeds:

```text
@obs /init

@obs /start fastapi-crud

@obs /task feature

@obs /complexity low

@obs /mark human-start

Create a FastAPI CRUD for patients.

@obs /mark human-stop

@obs /report cost

@obs /report consolidated

@obs /export all

@obs /stop
```

And the system produces:

```text
interactionCount
tokenMetrics
humanActiveTime
aiResponseTime
costReport
consolidatedReport
analyticsJson
analyticsCsv
```

without requiring any external database or dashboard.

---

# Future Dependencies

V0.2 prepares the foundation for:

* V0.3 Context Observability
* V0.4 Development Analytics
* V0.5 Agent Observability
* V0.7 Research Mode

The metrics introduced here are expected to be reused by all future roadmap modules.
