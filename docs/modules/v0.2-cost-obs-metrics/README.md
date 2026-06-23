# v0.2 — Cost Observability / CostOps Metrics

## Core Question

> How much did AI-assisted development cost?

## Objective

The goal of v0.2 is to expand AIDevObs from basic session observability into cost observability.

This version introduces metrics that help developers, instructors and researchers understand the cost profile of an AI-assisted development session.

Cost is not limited to money. In v0.2, cost includes:

- Estimated token consumption
- Number of interactions
- Human active time
- AI response time
- Session duration
- Complexity classification
- Task type classification
- Model usage

## Scope

v0.2 should capture and report:

- Task type
- Task complexity
- Human active time
- AI response time
- Interaction count
- Estimated input tokens
- Estimated output tokens
- Estimated total tokens
- Tokens per interaction
- AI time per interaction
- Human/AI time ratio

## Out of Scope

The following items are intentionally outside v0.2:

- Real billing integration with model providers
- Pricing tables per vendor
- Context source tracking
- RAG source attribution
- Agent routing
- Agent-level cost attribution
- Dashboard UI
- SQLite or database migration

## New Commands

```text
@obs /task <task-type>
@obs /complexity <level>
@obs /mark human-start
@obs /mark human-stop
@obs /cost
@obs /efficiency
@obs /report cost
@obs /report consolidated
@obs /export json
@obs /export csv
@obs /export all
```

## Recommended Task Types

```text
feature
bug
refactor
docs
research
test
architecture
```

## Recommended Complexity Levels

```text
trivial
low
medium
high
```

## Generated Artifacts

```text
.aidevobs/
  reports/
    <session-id>/
      v0.1-session-observability.md
      v0.2-cost-observability.md
      consolidated-report.md
      analytics.json
      analytics.csv
```

## Success Criteria

v0.2 is considered complete when a user can run:

```text
@obs /init
@obs /start fastapi-crud-cost-test
@obs /module m4
@obs /task feature
@obs /complexity low
@obs /mark human-start
@obs Create a FastAPI CRUD for patients with tests.
@obs /mark human-stop
@obs /summary
@obs /report cost
@obs /report consolidated
@obs /export all
@obs /stop
```

And obtain:

```text
.aidevobs/sessions/<session-id>/session.json
.aidevobs/sessions/<session-id>/chat-events.jsonl
.aidevobs/sessions/<session-id>/summary.md
.aidevobs/reports/<session-id>/v0.2-cost-observability.md
.aidevobs/reports/<session-id>/consolidated-report.md
.aidevobs/reports/<session-id>/analytics.json
.aidevobs/reports/<session-id>/analytics.csv
```

## Why This Module Matters

v0.2 creates the first economic and operational view of AI-assisted development.

It allows AIDevObs to move from:

> What happened?

To:

> What did it cost?

This is the foundation for later modules such as ContextOps, Development Analytics and AgentOps.

