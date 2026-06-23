# AIDevObs

## Overview

AIDevObs (AI Development Observability) is an experimental observability platform for AI-assisted software engineering.

The project provides a VS Code Chat participant (`@obs`) capable of capturing, measuring, organizing and analyzing AI-assisted development sessions.

The goal is not to replace coding assistants. The goal is to make AI-assisted development observable.

## Problem Statement

Modern software development increasingly relies on AI systems.

However, developers still lack visibility into:
- Context consumption
- Prompt evolution
- Human effort
- AI effort
- Session cost
- Agent interactions
- Architectural tradeoffs

AIDevObs aims to measure AI-assisted development.

## Vision

Observability pillars:
- SessionOps
- CostOps
- ContextOps
- Explainability
- AgentOps
- ResearchOps

## Installation

### Prerequisites

- Node.js 20+
- npm 10+
- Git
- Visual Studio Code

### Clone

```bash
git clone https://github.com/INNOVAI-LTDA/ai-dev-obs.git
cd ai-dev-obs
```

### Install

```bash
npm install
```

### Build

```bash
npm run compile
```

## Running

Open in VS Code and press F5.

Do not execute:

```bash
node out/extension.js
```

## First Session

```text
@obs /init
@obs /start first-session
@obs Create a Python calculator with tests.
@obs /summary
@obs /report
@obs /stop
```

## Architecture

Developer -> @obs -> Command Router -> Session Manager / Metrics / Reports -> .aidevobs

## Roadmap

v0.1 Session Observability
v0.2 Cost Observability
v0.3 Context Observability
v0.4 Development Analytics
v0.5 Agent Observability
v0.6 Architecture Observability
v0.7 Research Mode
v1.0 AI Development Intelligence Platform