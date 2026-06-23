# v0.2 Implementation Checklist

## Session Metadata

- [ ] Add `taskType` to session model.
- [ ] Add `complexity` to session model.
- [ ] Add CostOps metrics section.
- [ ] Persist updated schema version `0.2`.

## Time Tracking

- [ ] Implement `/mark human-start`.
- [ ] Implement `/mark human-stop`.
- [ ] Support multiple human active intervals.
- [ ] Aggregate `humanActiveTimeMs`.
- [ ] Measure AI response time automatically around model calls.
- [ ] Aggregate `aiResponseTimeMs`.

## Cost Metrics

- [ ] Aggregate input chars.
- [ ] Aggregate output chars.
- [ ] Estimate input tokens.
- [ ] Estimate output tokens.
- [ ] Estimate total tokens.
- [ ] Calculate tokens per interaction.
- [ ] Calculate AI time per interaction.
- [ ] Calculate human/AI ratio.

## Commands

- [ ] `/task`
- [ ] `/complexity`
- [ ] `/mark human-start`
- [ ] `/mark human-stop`
- [ ] `/cost`
- [ ] `/efficiency`
- [ ] `/report cost`
- [ ] `/report consolidated`
- [ ] `/export json`
- [ ] `/export csv`
- [ ] `/export all`

## Reports

- [ ] Generate `v0.2-cost-observability.md`.
- [ ] Generate `consolidated-report.md`.
- [ ] Generate `analytics.json`.
- [ ] Generate `analytics.csv`.

## Validation Scenario

Use the following flow:

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

Expected artifacts:

```text
.aidevobs/sessions/<session-id>/session.json
.aidevobs/sessions/<session-id>/chat-events.jsonl
.aidevobs/sessions/<session-id>/summary.md
.aidevobs/reports/<session-id>/v0.2-cost-observability.md
.aidevobs/reports/<session-id>/consolidated-report.md
.aidevobs/reports/<session-id>/analytics.json
.aidevobs/reports/<session-id>/analytics.csv
```

