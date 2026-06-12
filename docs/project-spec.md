# Ingeniux CMS Navigation Prototype Spec

## Intent

This project is a prototype for exploring a redesigned navigation system for the Ingeniux CMS. Its purpose is to make CMS navigation concepts visible, testable, and discussable before they are committed to production implementation.

The prototype focuses on how an author, administrator, or content operator moves between CMS domains, utilities, content trees, toolbars, and workspace modes. It is not currently intended to be a complete CMS implementation or a connected data application.

## Product Goal

Design and validate a clearer CMS navigation model that can support common Ingeniux workflows across site editing, asset management, campaign/taxonomy work, administration, and app-level tools.

The navigation should help users:

- Understand where they are in the CMS.
- Switch between major product domains without losing context unnecessarily.
- Browse structured site and asset trees.
- Choose the right task-specific tool for the selected item.
- Distinguish global/product navigation from local workspace actions.
- Preview how real CMS editing and preview surfaces might sit inside the shell.

## Current Prototype

The app is a Vite, React, TypeScript, and Mantine prototype. It renders a full-height CMS shell with:

- A product toolbar across the top.
- A domain selector for Dashboard, Site, Assets, CT&P, Admin, and Apps.
- A left navigation panel with a utility palette and tree/utility content area.
- A draggable splitter for resizing the left panel.
- A content workspace with primary and secondary toolbars.
- Shared megamenu primitives for command, dropdown, radio, checkbox, select, text input, and button controls.
- Site and asset tree data for testing tree selection behavior.
- Tool switching that changes based on whether the selected tree node is a folder or content item.
- Demo workspace images for Site Edit and Site Preview modes when available.

The root app is implemented in `src/app/App.tsx`. Top-level shell state and domain configuration live in `src/features/app-shell/AppShell.tsx`.

## Navigation Model

### Product Domains

The prototype treats each major CMS area as a product domain:

- `dashboard`: CMS home/status area.
- `site`: site tree, page editing, previewing, metadata, history, analytics, accessibility, and related authoring utilities.
- `assets`: asset tree, asset overview/editing, categorization, history, properties, DITA properties, and authoring.
- `ctp`: campaign, taxonomy, and records navigation for CT&P workflows.
- `administration`: user, role, workflow, and settings administration.
- `apps`: app-level tools, search, and properties.

Each domain owns its own utility palette, default utility, available content tools, and default selected tool.

### Utilities

Utilities are the left-panel modes inside a domain. Examples include Site Tree, Asset Tree, Search, Taxonomy, AI, CT&P, Assignments, Metadata, Automation, Workflow, Settings, and Tools.

When the selected utility is a tree utility, the left panel shows the domain tree. When the selected utility is not a tree, the prototype shows a placeholder utility surface.

### Trees

The Site and Assets domains currently have tree data. Tree selection drives:

- The selected item label shown in the workspace.
- The optional selected item XID shown in workspace controls.
- Whether the active toolbar should use folder tools or content tools.

Folder nodes use folder-oriented tools such as Folder Content and Properties. Content nodes use task-oriented content tools such as Edit, Preview, Categorize, History, XML, Analytics, Accessibility, or asset equivalents.

### Workspace

The workspace is the main task area. It is composed of:

- Primary toolbar: selected item context and available tools.
- Secondary toolbar: tool-specific supporting controls, including menu tabs and contextual toolbar actions.
- Content area: either a demo workspace image or a text placeholder representing the current selection/tool.

The Site domain currently supports demo images for Edit and Preview modes via `/demo/site-edit.png` and `/demo/site-preview.png`.

The Site tree shows an Options panel above the tree. The panel remains fixed while the tree itself scrolls independently and defaults closed. Clicking the Options row toggles it open and closed; its filter icon uses selected-state styling while open. Open and close height changes animate at 200ms ease-out, while height changes caused by horizontal resizing and text wrapping animate at 100ms ease-out.

Current options include a Publishing Target dropdown plus checkboxes for indicating publishing target roots, region roots, and DITA content. These options use the same custom checkbox row styling as the Edit > View megamenu for consistency and clearer selected states. The Publishing Target dropdown is visible by default, and the secondary toolbar Refresh action toggles its visibility in this panel. Publishing Target uses the same reusable custom pill dropdown component as the Content Tools selector rather than a native browser select.

Tree node labels truncate with an ellipsis when clipped and expose the full node name in a tooltip only when the rendered label is actually truncated.

### Secondary Toolbar

The secondary toolbar supports tool-specific megamenu tabs for Site and Assets workflows. Site Edit and Folder Content expose View, New, Actions, and a Publish Now menu marked with a robot icon. Site Preview exposes View, Preview Settings, Actions, and Publish menus.

Column-based megamenus measure their visible columns before rendering and use the widest measured column as the shared column width, including selected radio and checkbox font weight. Megamenu configs can cap the maximum number of columns per row; when a cap is lower than the column count, leftover columns render below an in-flow horizontal delimiter instead of continuing to wrap. Edit > Actions and Preview > Actions use a three-column cap; other megamenus allow natural wrapping. Radio and checkbox selected rows share the Site tree selected-row border/background treatment while retaining their own control affordances. Command/action rows use 20px icons with tighter vertical padding so command, radio, and checkbox rows align visually. Command rows briefly flash selected feedback before dismissing their parent megamenu. Megamenus use a short hover delay before opening, a short mouse-away grace period before closing, and clicking a command row closes the active megamenu after the feedback delay. The Publish megamenu has its own guided wizard layout and remains open while incomplete when the user mouses away; it closes only after completion or when the user clicks elsewhere.

The Site Edit Actions megamenu includes Mark for Publish and Publish columns. Mark for Publish exposes commands to mark or unmark the current page or the current page and children. Publish exposes a Publishing Target dropdown followed by commands for publishing the current page, the current page and children, or the site. The Publish column sizes to its longest command label, and its dropdown fills that measured column width without closing the parent megamenu when a target is selected. Site Edit Actions also includes a Check-in State column for Check In, Undo Checkout, and Rollback.

The Site Preview Actions megamenu includes the same Mark for Publish, Publish, and Check-in State columns as Site Edit Actions.

The Publish megamenu presents an automated three-step guided publishing flow:

1. Check in the current page, the current page and its descendants, or the whole site.
2. Mark the current page for publish, the current page and its descendants, or the whole site.
3. Publish marked pages to the selected target, or publish the whole site when Site scope is selected.

The wizard starts with a compact Publish Now label and control row. Users choose check-in scope, choose a publishing target, and press Start once. The delimiter and step row fade in, then the sequence runs automatically after the reveal delay. Each publish step starts numbered, enters a timed active state with plain-language status text, and then shows a completed check state. The scope toggle defaults to Page and can reveal a Site option for demos by clicking the secondary toolbar Search icon; revealing Site does not select it automatically. Status boxes share the tallest wrapped height across steps so the wizard controls stay aligned. Publish messaging refers to all marked pages because other pages may already be marked outside the wizard. The Publish completed state includes a subtle View publish details link. The target picker defaults to the Publishing Target selected in Site Settings unless changed in the wizard. Wizard progress is preserved while switching tabs in the running app, but resets on browser refresh.

The right side of the secondary toolbar includes compact action controls for Refresh, Save, and Search. Refresh toggles the Publishing Target dropdown visibility in the Site tree Options panel. A review-only control group containing Check in and Assign to is visible by default and can be toggled on and off with the Save icon.

The Assign to toolbar action opens a small dropdown aligned beneath the action itself. The dropdown uses the same megamenu command styling as the Site > Edit menus and contains:

- Me
- User...
- Group...

## Functional Requirements

- Users can switch product domains from the product toolbar.
- Each product domain has its own utility list.
- Each product domain remembers its selected utility.
- The Site domain returns to its default Site Tree utility when reselected.
- Users can select nodes in available trees.
- Users can select a publishing target without losing tree scroll position.
- Users can toggle tree options open and closed from the Options row.
- Users see the Publishing Target dropdown in Site tree Options by default and can reveal or hide it from the secondary toolbar Refresh action.
- Tree selection updates the workspace label and active tool context.
- Folder selections expose folder tools when configured.
- Content selections expose content tools.
- Tool selections are remembered separately for folder and content contexts within each domain.
- Users can resize the left panel with the workspace splitter.
- Users can toggle demo workspace visibility from the product toolbar.
- The workspace can fall back to a placeholder label when no demo image applies.
- Site Edit and Preview secondary toolbar tabs can open tool-specific megamenus.
- Site Edit secondary toolbar tabs appear in the order View, New, Actions, Publish Now.
- Site Edit and Preview Actions megamenus expose Mark for Publish and Publish command columns.
- Clicking a command row in a normal megamenu closes the active megamenu.
- Normal megamenus close after a short mouse-away grace period; the incomplete Publish wizard remains open on mouse-away and closes by outside click or after the wizard is complete.
- Users can start the guided Publish flow once and watch Check In, Mark for Publish, and Publish run automatically from left to right.
- Users can choose whether Check In and Mark for Publish apply to the page only, the page and descendants, or the whole site when the demo Site option is revealed.
- Users can choose a publish target in the final Publish step, defaulting to the Site Settings publishing target unless overridden in the wizard.
- Users can see publish progress and completion status text, plus a View publish details link after publishing.
- The secondary toolbar Assign to action can open a dropdown for assigning to self, a user, or a group.
- The secondary toolbar shows review-only Check in and Assign to controls by default, and the Save icon toggles them on and off.

## Design Requirements

- The experience should feel like an operational CMS workspace, not a marketing site.
- The app shell should prioritize clarity, scanning, repeated use, and quick context switching.
- Navigation controls should make current location and current task obvious.
- Domain navigation, utility navigation, tree browsing, and content tools should remain visually distinct.
- The prototype should preserve enough realism to support product conversations about Ingeniux CMS workflows.

## Technical Requirements

- Use React and TypeScript.
- Use Mantine for UI primitives and theming.
- Use Tabler icons where applicable.
- Keep feature code organized by shell, left panel, content workspace, toolbars, trees, and workspace types.
- Keep local component extraction consistent with the project's DisplayGroup convention.
- Keep shared megamenu item types and renderers reusable across primary toolbar menus, secondary toolbar menus, toolbar action dropdowns, and custom toolbar dropdown menus.
- Keep interaction styling explicit for the prototype shell: clickable controls use the pointer cursor, optional-hover megamenu tabs keep the default cursor, resize affordances such as the workspace splitter use resize cursors, and text selection is disabled except inside editable text inputs.
- Validate meaningful changes with `npm run build`.

## Deployment

The staging prototype is deployed to `stage.josephbrick.com` with `npm run deploy:stage`.

The deploy script builds the Vite app, syncs `dist/` to `s3://stage.josephbrick.com/`, deletes stale S3 files, and creates a CloudFront invalidation for `/*`.

Current staging architecture:

- S3 bucket: `stage.josephbrick.com`
- CloudFront distribution: `ES6M0K6KPAGL3`
- CloudFront alias: `stage.josephbrick.com`
- CloudFront Basic Auth is handled outside the React app by a CloudFront Function.
- CloudFront currently uses the S3 website endpoint origin, so deployed S3 objects must be uploaded with `public-read` ACLs.

The deploy IAM user needs S3 permissions for `ListBucket`, `PutObject`, `PutObjectAcl`, and `DeleteObject`, plus CloudFront permissions for `ListDistributions`, `CreateInvalidation`, and `GetInvalidation`.

## Non-Goals

- Connecting to live Ingeniux CMS APIs.
- Implementing authentication or authorization.
- Persisting user state outside the running browser session.
- Completing all utility surfaces.
- Replacing production CMS code.
- Modeling every CMS permission, workflow, or content type.

## Open Questions

- Which navigation concepts should be validated first with CMS users?
- Should CT&P remain a top-level domain or appear as a Site utility in some contexts?
- How should AI features be grouped: global assistant, site utility, contextual tool, or all of the above?
- What state should persist across domain changes in a production version?
- What are the final labels for ambiguous prototype items such as Mystery Feature and Tools?
- How closely should the prototype mirror existing Ingeniux CMS terminology versus proposed future terminology?

## Documentation Maintenance

When documentation is updated in future sessions, update this spec if product intent, navigation behavior, requirements, or open questions change. Also add an entry to `docs/chat-session-log.md` summarizing what changed and why.
