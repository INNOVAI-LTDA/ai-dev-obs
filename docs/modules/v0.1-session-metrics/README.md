# v0.1 — Session Metrics / Session Observability

## Core Question

> What happened during the AI-assisted development session?

## Objective

The goal of v0.1 is to establish the first observability layer for AI-assisted software development sessions.

This version focuses on capturing the basic execution trace of a development interaction mediated by the `@obs` VS Code Chat participant.

The main purpose is not yet cost optimization, context analysis or agent observability. The purpose is to create a reliable local record of what happened.

## Scope

v0.1 should capture:

- Session lifecycle
- User prompts
- Model responses
- Selected model
- Message timestamps
- Character counts
- Estimated token counts
- Basic latency
- Session summary
- Module and experiment tags

## Out of Scope

The following items are intentionally outside v0.1:

- Real provider billing
- Human active time tracking
- AI processing time aggregation
- Context source tracking
- Agent routing
- Tool call analysis
- Dashboard generation
- SQLite persistence
- Automatic code application to workspace

## Main Commands

```text
@obs /init
@obs /start <session title>
@obs /stop
@obs /summary
@obs /report session
@obs /module <module-id>
@obs /tag key=value
@obs /models
@obs /use-model <model-id>
@obs /model
```

## Generated Artifacts

```text
.aidevobs/
  sessions/
    <session-id>/
      session.json
      chat-events.jsonl
      summary.md
  reports/
    <session-id>/
      v0.1-session-observability.md
```

## Success Criteria

v0.1 is considered complete when a user can:

1. Initialize AIDevObs in a workspace.
2. Start an observable session.
3. Send prompts through `@obs`.
4. Capture prompts and model responses locally.
5. Generate a basic session summary.
6. Generate a v0.1 session observability report.
7. Stop the session cleanly.

## Why This Module Matters

Session observability is the foundation of all later AIDevObs modules.

Without reliable session data, later reports such as cost observability, context observability, development analytics and agent observability will be built on weak evidence.

v0.1 answers the simplest and most important first question:

> Can we reconstruct what happened in an AI-assisted development session?

