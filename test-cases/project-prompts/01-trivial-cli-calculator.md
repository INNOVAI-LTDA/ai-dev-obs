# Scenario 01 - Trivial - CLI Calculator

## AIDevObs setup

```text
@obs /start trivial cli calculator
@obs /module m1
@obs /tag scenario=trivial-cli-calculator complexity=trivial strategy=monolithic benchmark=swe-style
```

## Prompt

```text
Create a small Python 3.13 command-line calculator.

Requirements:
- Support add, subtract, multiply and divide.
- Expose a function calculate(operation: str, a: float, b: float) -> float.
- Raise ValueError for unsupported operations.
- Raise ZeroDivisionError for division by zero.
- Include pytest tests for all operations and errors.
- Include a short README section explaining how to run the tests.

Keep the implementation simple and avoid unnecessary architecture.
```
