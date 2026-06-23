# v0.2 Data Model

## Session Metrics Extension

v0.2 extends the v0.1 session model with CostOps fields.

```json
{
  "schemaVersion": "0.2",
  "sessionId": "2026-06-23T10-30-00-abc123",
  "title": "fastapi-crud-cost-test",
  "module": "m4",
  "taskType": "feature",
  "complexity": "low",
  "model": {
    "id": "MiniMax-M3-intl",
    "vendor": "cllms",
    "family": "minimax"
  },
  "metrics": {
    "interactionCount": 0,
    "inputChars": 0,
    "outputChars": 0,
    "totalChars": 0,
    "estimatedInputTokens": 0,
    "estimatedOutputTokens": 0,
    "estimatedTotalTokens": 0,
    "tokenCountingMethod": "totalchars/4",
    "humanActiveTimeMs": 0,
    "aiResponseTimeMs": 0,
    "totalSessionTimeMs": 0,
    "tokensPerInteraction": 0,
    "aiTimePerInteractionMs": 0,
    "humanAiRatio": 0
  }
}
```

## Human Time Marks

Human active time should be calculated from explicit marks.

```json
{
  "timestamp": "2026-06-23T10:32:00.000Z",
  "eventType": "mark",
  "markType": "human-start",
  "sessionId": "2026-06-23T10-30-00-abc123"
}
```

```json
{
  "timestamp": "2026-06-23T10:37:00.000Z",
  "eventType": "mark",
  "markType": "human-stop",
  "sessionId": "2026-06-23T10-30-00-abc123"
}
```

## AI Response Time

AI response time should preferably be measured automatically.

Suggested measurement:

```text
beforeModelCallTimestamp
afterModelResponseTimestamp
aiResponseTimeMs = afterModelResponseTimestamp - beforeModelCallTimestamp
```

## Analytics JSON

`analytics.json` is the canonical analytical export.

```json
{
  "schemaVersion": "0.2",
  "sessionId": "2026-06-23T10-30-00-abc123",
  "session": {
    "title": "fastapi-crud-cost-test",
    "module": "m4",
    "taskType": "feature",
    "complexity": "low",
    "model": "MiniMax-M3-intl",
    "startedAt": "2026-06-23T10:30:00.000Z",
    "endedAt": "2026-06-23T11:00:00.000Z"
  },
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
    "totalSessionTimeMs": 0,
    "tokensPerInteraction": 0,
    "aiTimePerInteractionMs": 0,
    "humanAiRatio": 0
  },
  "events": []
}
```

## Analytics CSV

`analytics.csv` is derived from `analytics.json` and should contain one row per session.

```csv
schemaVersion,sessionId,title,module,taskType,complexity,model,interactionCount,inputChars,outputChars,totalChars,estimatedInputTokens,estimatedOutputTokens,estimatedTotalTokens,humanActiveTimeMs,aiResponseTimeMs,totalSessionTimeMs,tokensPerInteraction,aiTimePerInteractionMs,humanAiRatio
```

