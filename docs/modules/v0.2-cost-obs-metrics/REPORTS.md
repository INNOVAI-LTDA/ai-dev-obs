# v0.2 Reports

## Report Folder

```text
.aidevobs/reports/<session-id>/
```

## Reports Generated in v0.2

```text
v0.1-session-observability.md
v0.2-cost-observability.md
consolidated-report.md
analytics.json
analytics.csv
```

## v0.2 Cost Observability Report

File:

```text
v0.2-cost-observability.md
```

Purpose:

- Estimate the operational cost of the session.
- Compare human effort and AI response time.
- Surface interaction intensity.
- Prepare data for future dashboards.

Suggested structure:

```markdown
# AIDevObs v0.2 Cost Observability Report

## Session

- Session ID:
- Title:
- Module:
- Task Type:
- Complexity:
- Model:

## Usage Metrics

- Interaction Count:
- Input Chars:
- Output Chars:
- Total Chars:
- Estimated Input Tokens:
- Estimated Output Tokens:
- Estimated Total Tokens:
- Token Counting Method:

## Time Metrics

- Human Active Time:
- AI Response Time:
- Total Session Time:

## Efficiency Metrics

- Tokens per Interaction:
- AI Time per Interaction:
- Human/AI Ratio:
- Tokens per Minute:

## Notes

- Token metrics are estimates.
- Cost metrics are proxy metrics, not real billing.
```

## Consolidated Report

File:

```text
consolidated-report.md
```

Purpose:

The consolidated report summarizes all available observability layers for the session.

In v0.2, it should combine:

- v0.1 Session Observability
- v0.2 Cost Observability
- Generated artifacts
- Export locations

## Analytics Exports

### analytics.json

Canonical analytical dataset for future dashboards.

### analytics.csv

Flat file for Excel, Power BI, DuckDB, notebooks or future dashboard tools.

## Commands

```text
@obs /report cost
@obs /report consolidated
@obs /export json
@obs /export csv
@obs /export all
```

