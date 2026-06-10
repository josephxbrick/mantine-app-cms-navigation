---
name: study-project-first
description: Use when starting a repo task where Codex should read project docs, config, and relevant source code before implementing changes; especially when the user asks to study the docs and codebase first, follow existing patterns, avoid unrelated refactors, and verify afterward.
---

# Study Project First

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
