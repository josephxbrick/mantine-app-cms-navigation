---
name: session-start
description: Use when beginning a new repo chat or coding session where Codex should orient itself by reading project docs, config, and relevant source code before implementing changes; especially when the user asks to start a session, study the repo first, follow existing patterns, avoid unrelated refactors, and verify afterward.
---

# Session Start

Before implementing changes:

1. Read the project documentation, configuration files, and relevant source code needed to understand the app's architecture, conventions, dependencies, and current state.
2. Summarize the important context internally enough to guide the work. Share a brief user-facing orientation only when it helps or when the user asks for it.
3. Make the requested change in the smallest way that fits existing patterns.
4. Avoid unrelated refactors and metadata churn.
5. Preserve user changes already present in the working tree. Do not revert changes you did not make unless the user explicitly asks.
6. Verify with the relevant available checks, such as tests, lint, typecheck, or build. If a check cannot be run, explain why.

Finish by summarizing:

- What changed
- Which files were touched
- What verification ran
- Any remaining risks or follow-up notes
