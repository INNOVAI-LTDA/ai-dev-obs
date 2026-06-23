# AIDevObs Project Prompt Template

Use this template to create comparable AI-assisted development experiments.

## Metadata

```yaml
id: <unique-id>
title: <project-title>
complexity: trivial | low | medium | high
module: m1 | m2 | m3 | m4 | m5 | m6 | m7 | m8
strategy: monolithic | incremental | specialist | retrieval-like | tool-like
expected_language: python | typescript | javascript | other
expected_stack: <stack>
```

## Prompt

```text
You are helping implement a software project.

Project:
<short project name>

Business or technical goal:
<goal>

Constraints:
- <constraint 1>
- <constraint 2>

Functional requirements:
1. <requirement>
2. <requirement>

Non-functional requirements:
- <requirement>

Expected deliverables:
- <file/module/function>
- <tests>
- <README or usage instructions>

Evaluation criteria:
- correctness
- maintainability
- testability
- minimal unnecessary complexity

Do not assume external services unless explicitly requested.
```

## Suggested AIDevObs setup

```text
@obs /start <project-title>
@obs /module <module-id>
@obs /tag scenario=<unique-id> complexity=<complexity> strategy=<strategy>
```
