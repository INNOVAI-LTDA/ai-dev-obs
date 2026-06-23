# v0.1 Reports

## Report File

```text
.aidevobs/reports/<session-id>/v0.1-session-observability.md
```

## Report Purpose

The v0.1 report reconstructs the basic development session trace.

It should answer:

- What was the session about?
- Which model was selected?
- How many interactions happened?
- How many characters were sent and received?
- What was the estimated token consumption?
- Which module and experiment tags were associated with the session?

## Suggested Report Structure

```markdown
# AIDevObs v0.1 Session Observability Report

## Session Metadata

- Session ID:
- Title:
- Status:
- Started At:
- Ended At:
- Module:
- Tags:
- Model:

## Interaction Summary

- Interaction Count:
- User Messages:
- Assistant Messages:

## Character Metrics

- Input Chars:
- Output Chars:
- Total Chars:

## Token Estimation

- Estimated Input Tokens:
- Estimated Output Tokens:
- Estimated Total Tokens:
- Token Counting Method: totalchars/4

## Generated Artifacts

- session.json
- chat-events.jsonl
- summary.md
- v0.1-session-observability.md
```

## Report Command

```text
@obs /report session
```

## Default Behavior

In v0.1, the command below may also generate the same report:

```text
@obs /report
```

