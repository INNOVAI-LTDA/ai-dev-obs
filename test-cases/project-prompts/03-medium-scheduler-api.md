# Scenario 03 - Medium - Appointment Reminder Scheduler

## AIDevObs setup

```text
@obs /start medium appointment reminder scheduler
@obs /module m5
@obs /tag scenario=medium-scheduler-api complexity=medium strategy=specialist benchmark=swe-style
```

## Prompt

```text
Create a Python/FastAPI backend for appointment reminders in a medical clinic.

Goal:
Reduce missed appointments by generating reminders before appointments.

Requirements:
- Entities: Patient, Appointment, Reminder.
- Appointment has scheduled_at, patient_id, status and channel preference.
- Reminder has appointment_id, due_at, channel, status and attempts.
- Endpoint to create patients.
- Endpoint to create appointments.
- Endpoint to list pending reminders due before a given datetime.
- Endpoint to mark a reminder as sent or failed.
- Generate one reminder 24 hours before the appointment.
- Use SQLite.
- Include tests for reminder generation and due reminder filtering.

Constraints:
- Do not integrate with WhatsApp, SMS or email providers.
- Keep the design simple but modular enough to test.
```
