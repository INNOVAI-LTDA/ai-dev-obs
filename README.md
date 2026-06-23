# AIDevObs

**AIDevObs** is an experimental VS Code extension for observability in AI-assisted software development.

It turns the VS Code Chat participant `@obs` into an observable AI proxy. Prompts, model responses, selected models, latency, estimated tokens, course module tags and experiment metadata are stored locally in `.aidevobs/`.

## Why this exists

AI-assisted development is increasingly shaped by context, memory-like retrieval, tool calls, model routing and agent specialization. AIDevObs is built as a practical instrument for measuring those workflows instead of guessing what happened.

Use it as:

- a development trace logger;
- a lightweight AI Dev Observability tool;
- a classroom lab for AI-assisted software engineering;
- an experiment tracker for prompt/context/model comparisons.

## Main chat commands

```text
@obs /init
@obs /start prompt-size experiment for FastAPI CRUD
@obs /course
@obs /module m1
@obs /tag experiment=prompt-size strategy=large-context complexity=low
@obs /models
@obs /use-model MiniMax-M3-intl
@obs /model
@obs Build a FastAPI CRUD for patients with CPF and birth date.
@obs /summary
@obs /report
@obs /stop
```

## Repository layer

```text
.aidevobs/
  obs.yaml
  sessions/
    <session-id>/
      session.json
      chat-events.jsonl
      summary.md
  reports/
    <session-id>-module-report.md
  policies/
  templates/
```

## Course modules supported by the tool

```text
m0 - What are we observing?
m1 - The context problem
m2 - What does AI really learn?
m3 - Does the model remember or retrieve?
m4 - The invisible cost of AI
m5 - Generalist agent vs specialist agents
m6 - Does architecture matter?
m7 - Is intelligence in the unit or in the network?
m8 - Beyond Context
```

## New learning/reporting workflow

1. Start a session.
2. Tag the course module.
3. Add experiment tags.
4. Run one or more prompts.
5. Generate a session summary.
6. Generate a module report.

Example:

```text
@obs /start trivial prompt-size test
@obs /module m1
@obs /tag experiment=prompt-size strategy=short-context complexity=trivial scenario=trivial-cli-calculator
@obs Create a Python CLI calculator with add, subtract, multiply and divide, including pytest tests.
@obs /summary
@obs /report
@obs /stop
```

## Test cases

Structured project prompts are included in:

```text
test-cases/project-prompts/
```

They are organized by complexity:

- trivial;
- low;
- medium;
- high.

A reusable prompt template is available at:

```text
test-cases/project-prompts/PROMPT_TEMPLATE.md
```

## Current limitations

- AIDevObs only logs messages sent through `@obs`.
- It does not capture Copilot, `@workspace`, terminal or third-party chat participants.
- Token metrics are estimated with `totalchars/4`, not real provider billing.
- Code is not applied automatically to the workspace.
- Module reports are lightweight classroom/experiment artifacts, not statistical reports.

## Positioning

AIDevObs is not a coding assistant replacement. It is an observability layer for AI-assisted development.

Think of it as a first oscilloscope for measuring how humans, prompts, context and models interact during software construction.
