# Scenario 04 - High - Import Document Compliance Sandbox

## AIDevObs setup

```text
@obs /start high import compliance sandbox
@obs /module m6
@obs /tag scenario=high-import-compliance complexity=high strategy=specialist-routing benchmark=swe-style
```

## Prompt

```text
Design and implement a simplified Python sandbox for assisted import document compliance analysis.

Goal:
Compare information extracted from Commercial Invoice, Packing List and Bill of Lading records.

Input:
Use structured Python dictionaries or JSON fixtures. Do not implement OCR.

Requirements:
- Define normalized data structures for invoice, packing list and bill of lading.
- Implement extraction/normalization functions for each document type.
- Implement a reconciliation engine that detects inconsistencies across documents:
  - item quantity mismatch
  - gross weight mismatch
  - missing HS/NCM-like classification field
  - inconsistent consignee/importer name
- Implement severity levels: info, warning, critical.
- Produce a compliance recommendation report as JSON.
- Include tests with at least three cases:
  - consistent documents
  - quantity mismatch
  - multiple critical divergences

Architecture requirement:
Separate the code into modules that roughly represent specialist responsibilities:
- document normalization
- reconciliation
- risk scoring
- reporting

Do not use external APIs. Keep everything local and deterministic.
```
