# v0.1 Data Model

## Session Model

```json
{
  "schemaVersion": "0.1",
  "sessionId": "2026-06-23T10-30-00-abc123",
  "title": "fastapi-crud-session-test",
  "status": "active",
  "startedAt": "2026-06-23T10:30:00.000Z",
  "endedAt": null,
  "module": "m1",
  "tags": {
    "experiment": "prompt-size",
    "complexity": "low"
  },
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
    "tokenCountingMethod": "totalchars/4"
  }
}
```

## Chat Event Model

Each chat event should be appended to `chat-events.jsonl`.

```json
{
  "timestamp": "2026-06-23T10:31:00.000Z",
  "eventType": "message",
  "role": "user",
  "content": "Create a FastAPI CRUD for patients.",
  "chars": 38,
  "estimatedTokens": 10,
  "tokenCountingMethod": "totalchars/4",
  "modelId": "MiniMax-M3-intl",
  "sessionId": "2026-06-23T10-30-00-abc123"
}
```

## Notes

- Token metrics are estimates.
- v0.1 does not attempt to match real provider billing.
- `chat-events.jsonl` is the event source.
- `session.json` is the current session state snapshot.

