---
name: session-end
description: Use when the user asks to end, close, wrap up, finish, or hand off a coding session: update project docs/spec when behavior changed, summarize work in a session log, verify git state, optionally build/test when requested, commit and push only after cautious review, and ask whether to deploy without deploying automatically.
---

# Session End

Use this skill to end a repo session cleanly.

## Workflow

1. Confirm scope from the user's close-out request.
   - If they explicitly ask for build/test, run those checks.
   - If they do not ask for build/test, do not run them.
   - Never deploy automatically. Ask whether they want to deploy after push.

2. Inspect repo state.
   - Run `git status --short --branch`.
   - Run `git diff --stat`.
   - Review changed source files enough to understand what will be committed.
   - Identify untracked files and decide whether they belong in the commit. Ask before including questionable generated, duplicate, secret, or artifact files.

3. Write a session log.
   - Prefer an existing session log if the project has one.
   - If none exists, create or append to a concise repo-local log such as `SESSION_LOG.md`.
   - Include date, branch, summary of changes, verification performed, uncommitted/untracked files considered, and next steps.

4. Update project docs/spec.
   - Look for the project spec or equivalent product documentation, such as `docs/project-spec.md`, `README.md`, or architecture notes.
   - If the session changed product behavior, UI behavior, workflow rules, configuration, deployment process, or important implementation constraints, update the relevant docs before committing.
   - If the docs are already current, record that explicitly in the session log notes instead of making a no-op edit.
   - Include the docs/spec update, or the "already current" note, in the close-out summary.

5. Verify.
   - Run requested checks, such as `npm run build`.
   - If a check creates generated artifacts that are not meant to be committed, restore/remove only those generated files after explaining it.
   - Do not run extra expensive or artifact-producing checks unless requested or clearly necessary.

6. Commit cautiously.
   - Re-check `git status --short --branch`.
   - Stage only intentional files.
   - Do not stage unrelated user changes unless the user clearly asked for "everything" and the files are appropriate to commit.
   - Use a concise commit message that describes the session outcome.
   - Run `git diff --cached --stat` before committing.

7. Push.
   - Push the current branch.
   - If push fails because the remote is behind, fetch/pull cautiously according to the repo's normal workflow and avoid overwriting user work.

8. Close with a clear handoff.
   - Mention branch, commit hash, pushed remote/branch, checks run and result, docs/spec status, and any files intentionally left uncommitted.
   - Ask: "Do you want to deploy this to AWS?" if the user has deployment set up elsewhere.

## Guardrails

- Do not use destructive git commands.
- Do not deploy unless the user explicitly confirms after the close-out summary.
- Do not include build artifacts, duplicate images, local screenshots, logs, credentials, or environment files unless the user explicitly wants them committed.
- If there are unrelated changes, keep them out of the commit and call them out.
