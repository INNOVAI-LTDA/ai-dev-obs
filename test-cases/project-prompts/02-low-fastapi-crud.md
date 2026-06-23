# Scenario 02 - Low - FastAPI Patient CRUD

## AIDevObs setup

```text
@obs /start low fastapi patient crud
@obs /module m4
@obs /tag scenario=low-fastapi-crud complexity=low strategy=incremental benchmark=swe-style
```

## Prompt

```text
Create a minimal FastAPI application for patient registration.

Requirements:
- Entity: Patient with id, full_name, cpf, birth_date and active.
- Use SQLite with SQLAlchemy or a clear in-memory repository if you prefer simplicity.
- Endpoints:
  - POST /patients
  - GET /patients
  - GET /patients/{id}
  - PATCH /patients/{id}
  - DELETE /patients/{id}
- Validate CPF as a required string field, but do not implement official CPF digit validation.
- Include basic pytest tests for create, list and not found.
- Include instructions to run the API and tests.

Prioritize clarity over enterprise architecture.
```
