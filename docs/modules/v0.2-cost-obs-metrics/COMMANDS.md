# v0.2 Commands

## /task

Sets the task type for the active session.

```text
@obs /task feature
```

Allowed values:

```text
feature
bug
refactor
docs
research
test
architecture
```

## /complexity

Sets the task complexity.

```text
@obs /complexity low
```

Allowed values:

```text
trivial
low
medium
high
```

## /mark human-start

Starts a human active time interval.

```text
@obs /mark human-start
```

## /mark human-stop

Stops a human active time interval.

```text
@obs /mark human-stop
```

## /cost

Shows current CostOps metrics for the active session.

```text
@obs /cost
```

## /efficiency

Shows quick session efficiency metrics.

```text
@obs /efficiency
```

## /report cost

Generates the v0.2 Cost Observability report.

```text
@obs /report cost
```

## /report consolidated

Generates a consolidated report for all currently implemented observability modules.

```text
@obs /report consolidated
```

## /export json

Generates `analytics.json`.

```text
@obs /export json
```

## /export csv

Generates `analytics.csv`.

```text
@obs /export csv
```

## /export all

Generates all analytical exports.

```text
@obs /export all
```

