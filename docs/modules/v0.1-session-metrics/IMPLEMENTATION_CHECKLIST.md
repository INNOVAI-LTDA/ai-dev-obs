# v0.1 Implementation Checklist

## Session Lifecycle

- [ ] Create `.aidevobs/` folder on `/init`.
- [ ] Create session folder on `/start`.
- [ ] Persist `session.json`.
- [ ] Append chat events to `chat-events.jsonl`.
- [ ] Update session status on `/stop`.

## Metrics

- [ ] Count user message characters.
- [ ] Count assistant message characters.
- [ ] Estimate tokens with `totalchars/4`.
- [ ] Store token counting method explicitly.
- [ ] Track interaction count.

## Reports

- [ ] Generate `summary.md`.
- [ ] Generate `v0.1-session-observability.md`.

## Commands

- [ ] `/init`
- [ ] `/start`
- [ ] `/stop`
- [ ] `/summary`
- [ ] `/report session`
- [ ] `/module`
- [ ] `/tag`
- [ ] `/models`
- [ ] `/use-model`
- [ ] `/model`

