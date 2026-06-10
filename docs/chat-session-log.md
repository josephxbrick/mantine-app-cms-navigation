# Chat Session Log

This log tracks project decisions, documentation updates, implementation notes, and useful context from Codex chat sessions. Add a new entry whenever documentation is intentionally updated.

## Entry Format

```md
## YYYY-MM-DD - Short Session Title

### Summary

- What changed or was decided.

### Files Updated

- `path/to/file.md`

### Notes

- Follow-up context, open questions, or verification details.
```

## 2026-06-03 - Initial Project Documentation

### Summary

- Created the project documentation folder.
- Added a project spec for the Ingeniux CMS navigation prototype.
- Captured the current prototype intent, navigation model, functional requirements, design requirements, technical requirements, non-goals, and open questions.
- Established this chat session log as the place to record future documentation updates.

### Files Updated

- `docs/project-spec.md`
- `docs/chat-session-log.md`

### Notes

- The current app is a Vite, React, TypeScript, and Mantine prototype.
- The main prototype scope is navigation for CMS domains, utilities, site/asset trees, toolbars, and workspace modes.
- Future documentation updates should append a new dated entry here.

## 2026-06-03 - Secondary Toolbar Review Controls

### Summary

- Extended the secondary toolbar with reusable action-button rendering based on shared megamenu item types.
- Added a `dropdown` megamenu item type and shared `MegamenuActionItem` presentation for command and dropdown-style actions.
- Added secondary toolbar actions for `Check in`, `Assign to`, `Refresh`, `Save`, and `Search`.
- Implemented the `Assign to` toolbar dropdown using the same Mantine menu and megamenu primitives used by existing Site > Edit dropdown menus.
- Configured the `Assign to` dropdown options as `Me`, `User...`, and `Group...` with the same icons used by the Site > Edit Assign To menu.
- Made the `Check in` + `Assign to` review controls and their delimiter hidden by default, with the Save icon toggling them on and off for review-meeting use.

### Files Updated

- `docs/chat-session-log.md`
- `docs/project-spec.md`
- `src/features/content-workspace/megamenus/MegamenuRenderer.tsx`
- `src/features/content-workspace/megamenus/types.ts`
- `src/features/content-workspace/toolbars/SecondaryToolbar.tsx`
- `src/features/content-workspace/toolbars/ToolbarDelimiter.tsx`

### Notes

- `Assign to` uses `IconUserCheck` on the toolbar trigger.
- The secondary toolbar `Assign to` dropdown has no header and uses `width="target"` so it matches the toolbar item width.
- The review controls are prototype-only visibility affordances for meeting review and are intentionally toggled with the Save icon.
- Verification: `npm run build` passed after the implementation updates.

## 2026-06-09 - Publishing Target Tree Control

### Summary

- Added a fixed Site tree Options panel above the scrollable tree, defaulting closed.
- Added animated Options panel open/close behavior with selected-state filter icon styling.
- Added tree option checkboxes for publishing target root, region root, and DITA content indicators.
- Added a Publishing Target dropdown with QA, Staging, and Production options; Production is the selected value by default, and the dropdown itself is hidden by default.
- Wired the secondary toolbar Refresh action to toggle Publishing Target dropdown visibility.
- Replaced native Publishing Target selects with a reusable custom pill dropdown shared with the Content Tools selector.
- Updated custom dropdown menus so surrounded controls use the whole control width, dropdown-only controls use a top label, trigger/menu icons are optional, selected/hover states match tree colors, and Launch in Browser hugs its content.
- Added ellipsis truncation plus full-name tooltips for clipped tree node labels.
- Changed the secondary toolbar Check in and Assign to review controls to start visible by default.

### Files Updated

- `docs/chat-session-log.md`
- `docs/project-spec.md`
- `src/features/app-shell/AppShell.tsx`
- `src/features/content-workspace/ContentWorkspace.tsx`
- `src/features/content-workspace/megamenus/MegamenuRenderer.tsx`
- `src/features/content-workspace/toolbars/primary-toolbar/PrimaryToolbar.tsx`
- `src/features/content-workspace/toolbars/primary-toolbar/PrimaryToolbarPaper.tsx`
- `src/features/content-workspace/toolbars/SecondaryToolbar.tsx`
- `src/features/content-workspace/toolbars/ToolbarSelectMenu.tsx`
- `src/features/left-panel/LeftPanel.tsx`
- `src/features/left-panel/LeftPanelHeader.tsx`
- `src/features/left-panel/site-tree/SiteTree.tsx`
- `src/features/left-panel/site-tree/SiteTreeItem.tsx`

### Notes

- The selector is local prototype state and does not connect to live publishing behavior.
- Verification: `npm run build` passed after the implementation updates.

## 2026-06-09 - New Chat Handoff Checkpoint

### Summary

- Prepared the project for a clean follow-up chat.
- Confirmed the current product spec already reflects the latest implemented CMS navigation prototype behavior.
- Confirmed the working tree was clean before the handoff update.
- Fixed a React Hooks lint issue in the Site tree Options panel animation by moving the open/close transition reset into the toggle path while keeping resize-driven height transitions handled by the resize observer.

### Files Updated

- `docs/chat-session-log.md`
- `src/features/left-panel/site-tree/SiteTree.tsx`
- `dist/index.html`
- `dist/assets/index-DRAmBAso.js`

### Notes

- Next chat should start by reading `docs/project-spec.md` and this session log.
- Current branch: `main`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-06-09 - Staging Deploy Script and AWS Setup

### Summary

- Added a reusable staging deployment script and `npm run deploy:stage` command.
- Configured the script to build the prototype, sync `dist/` to `s3://stage.josephbrick.com/`, delete stale S3 files, and invalidate CloudFront paths.
- Set up the deploy around CloudFront distribution `ES6M0K6KPAGL3` and alias `stage.josephbrick.com`.
- Created and refined the IAM policy requirements for the deploy user, including `s3:PutObjectAcl` and `cloudfront:GetInvalidation`.
- Diagnosed a post-auth `403` after the first successful upload: CloudFront Basic Auth was working, but the S3 website endpoint origin required public-readable objects.
- Updated the deploy script to use `--acl public-read`, redeployed, and confirmed the S3 website endpoint returned `200 OK` for `index.html`.
- Confirmed the latest CloudFront invalidation completed.

### Files Updated

- `README.md`
- `docs/chat-session-log.md`
- `docs/project-spec.md`
- `package.json`
- `scripts/deploy-stage.sh`

### Notes

- Latest successful deploy invalidation: `I895R4OVPLQ83HTTJA93VCFAQI`.
- The CloudFront Basic Auth challenge still returns `401` before valid credentials, which is expected.
- Current staging architecture uses the S3 website endpoint origin. If staging is later moved to CloudFront Origin Access Control, remove `--acl public-read` from `scripts/deploy-stage.sh` and update the S3 bucket policy instead.
- Verification: `npm run deploy:stage` completed successfully, and `aws cloudfront get-invalidation --distribution-id ES6M0K6KPAGL3 --id I895R4OVPLQ83HTTJA93VCFAQI` returned `Completed`.

## 2026-06-09 - Conditional Tree Label Tooltips

### Summary

- Updated Site tree node labels so the full-label tooltip only appears when the rendered text is actually truncated with an ellipsis.
- Added measured overflow detection using the label element's `scrollWidth` and `clientWidth`, with resize observation so the tooltip state follows left-panel width changes.
- Rebuilt, committed, pushed, and deployed the update to `stage.josephbrick.com`.
- Confirmed the CloudFront invalidation for the deploy completed.

### Files Updated

- `docs/chat-session-log.md`
- `docs/project-spec.md`
- `src/features/left-panel/site-tree/SiteTreeItem.tsx`
- `dist/index.html`
- `dist/assets/index-3lgj3OkO.js`

### Notes

- Source commit for the behavior change: `cfe630b Show tree tooltips only when truncated`.
- Latest staging invalidation: `IDFV83BKAQ0PXY5BBYEM7DTDJO`.
- Verification: `npm run build`, `npm run lint`, and `npm run deploy:stage` passed. `aws cloudfront get-invalidation --distribution-id ES6M0K6KPAGL3 --id IDFV83BKAQ0PXY5BBYEM7DTDJO` returned `Completed`.

## 2026-06-10 - Publish Megamenu Wizard

### Summary

- Replaced the Edit Publish megamenu contents with a guided three-step publish flow for Check In, Mark for Publish, and Publish.
- Added scoped Page vs Page & Children toggle controls, animated step completion with spinner/check states, and a publish target picker that defaults from Site Settings.
- Added in-memory wizard state so switching tabs does not reset progress, while refresh still resets the flow.
- Updated publish megamenu layout to fill available width using a configurable step/gap ratio, with outside padding treated as equal visual gaps.
- Adjusted megamenu column sizing to fit content width and refined Actions megamenu content by moving Check In, Undo Checkout, and Rollback into a Versioning column.
- Added delayed megamenu mouse-away behavior, with Publish staying open until the wizard completes or the user clicks elsewhere.
- Added the repo-local `close-session` skill for session wrap-up, cautious git review, session logging, commit/push, and AWS deployment handoff.

### Files Updated

- `.agents/skills/close-session/SKILL.md`
- `docs/chat-session-log.md`
- `src/features/app-shell/AppShell.tsx`
- `src/features/content-workspace/ContentWorkspace.tsx`
- `src/features/content-workspace/megamenus/MegamenuRenderer.tsx`
- `src/features/content-workspace/toolbars/SecondaryToolbar.tsx`
- `src/features/content-workspace/tools/edit/megamenus/MegamenuActions.tsx`
- `src/features/content-workspace/tools/edit/megamenus/MegamenuPublish.tsx`

### Notes

- Current branch: `experiment/major-change`.
- Verification: `git diff --check` passed. `npm run build` passed after close-out review.
- Left local demo image artifacts uncommitted: `public/demo/site-edit.local-before-pull.png` and `public/demo/site-edit.png.png`.
