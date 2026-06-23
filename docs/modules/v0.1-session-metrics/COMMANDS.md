# v0.1 Commands

## /init

Initializes the `.aidevobs/` workspace structure.

```text
@obs /init
```

## /start

Starts a new observable development session.

```text
@obs /start fastapi-crud-session-test
```

## /stop

Stops the active session and persists final metadata.

```text
@obs /stop
```

## /summary

Generates a human-readable summary of the current session.

```text
@obs /summary
```

## /report session

Generates the v0.1 session observability report.

```text
@obs /report session
```

## /module

Associates the current session with a course module.

```text
@obs /module m1
```

## /tag

Adds metadata tags to the session.

```text
@obs /tag experiment=prompt-size strategy=short-context complexity=low
```

## /models

Lists available VS Code language models.

```text
@obs /models
```

## /use-model

Selects a model for the session.

```text
@obs /use-model MiniMax-M3-intl
```

## /model

Displays the currently selected model.

```text
@obs /model
```

