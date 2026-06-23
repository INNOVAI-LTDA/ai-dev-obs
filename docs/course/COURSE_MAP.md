# AIDevObs Course Map

## Course thesis

Modern AI-assisted software development is not only about writing better prompts. It is about understanding how context, memory-like retrieval, model behavior, latency, cost and specialization shape the development process.

AIDevObs is used as the practical measurement tool throughout the course.

## Modules

### M0 - What are we observing?

Goal: introduce AI-assisted development as a measurable workflow.

AIDevObs usage:

- `/start`
- `/status`
- `/summary`

Report: basic session summary.

### M1 - The context problem

Goal: compare short, medium and large prompts.

AIDevObs usage:

- `/module m1`
- `/tag experiment=prompt-size strategy=short-context|medium-context|large-context`
- `/report`

Report: context/cost comparison artifact.

### M2 - What does AI really learn?

Goal: separate training, weights, representation and inference.

AIDevObs usage:

- tag sessions by task type: `feature`, `explain`, `refactor`.

Report: session trace showing how the model uses parametric knowledge.

### M3 - Does the model remember or retrieve?

Goal: compare no-RAG, RAG-like, memory-like and tool-result-like prompts.

AIDevObs usage:

- `/tag knowledge=parametric|contextual|retrieved|tool-result`

Report: evidence that all external mechanisms become input tokens.

### M4 - The invisible cost of AI

Goal: expose tokens, chars, latency and interaction volume.

AIDevObs usage:

- compare bug, feature, refactor and documentation sessions.

Report: cost-oriented module report.

### M5 - Generalist agent vs specialist agents

Goal: compare one large monolithic prompt with role-based specialist prompting.

AIDevObs usage:

- `/tag strategy=monolithic|specialists role=architect|backend|qa`

Report: specialist strategy comparison.

### M6 - Does architecture matter?

Goal: discuss context routing, model routing and orchestration.

AIDevObs usage:

- model selection and tags by model/task.

Report: model/context routing observation.

### M7 - Is intelligence in the unit or in the network?

Goal: introduce systems thinking, networks and emergence.

AIDevObs usage:

- optional bonus exercise using sequential specialist prompts.

Report: flow interpretation.

### M8 - Beyond Context

Goal: synthesize the course thesis.

AIDevObs usage:

- final comparison between monolithic, specialist and retrieval-heavy workflows.

Report: final experiment report.
