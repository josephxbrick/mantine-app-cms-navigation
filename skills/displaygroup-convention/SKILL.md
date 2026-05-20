---
name: displaygroup-convention
description: Apply this project's React DisplayGroup composition convention to component files, especially Mantine toolbar, panel, menu, and workspace UI files. Use when asked to refactor a generated file into named display pieces, extract repeated JSX layout into local DisplayGroup or *Group helpers, keep exported components as high-level composition, or follow the ProductToolbarPaper-style convention.
---

# DisplayGroup Convention

Use this skill to refactor React UI files into this project's local display-piece convention.

## Workflow

1. Read the target file and one nearby component that already uses a `DisplayGroup` pattern.
2. Identify the exported component's visual regions and repeated inline layout groups.
3. Extract visual wrappers into small local components:
   - `DisplayGroup` for the outer surface.
   - `ToolbarDelimiter`, `PanelDelimiter`, or a similarly specific delimiter component for separators.
   - `*Group` components for repeated Mantine `Group` layout settings.
   - Named control components for user-visible controls, menus, fields, and buttons.
4. Use a shared props type only when multiple local display helpers accept the same shape, such as:

```tsx
type ToolbarGroupProps = {
  children: ReactNode;
};
```

5. Keep display helpers near the top of the file, after constants and prop types.
6. Keep behavior-specific components and handlers near the controls they support.
7. In the exported component, compute named prop objects before `return` when a child receives several props:

```tsx
const goToSearchControlProps = {
  fieldWidth,
  searchVisible,
  onOpen: handleOpen,
  onClose: handleClose,
};
```

8. Make the exported component's JSX read as a high-level inventory of the surface:

```tsx
return (
  <DisplayGroup>
    <GoToSearchControl {...goToSearchControlProps} />
    <ToolbarDelimiter />
    <RecentMenuButton />
    <UserMenuButton />
    <ToolbarDelimiter />
    <HelpButton />
  </DisplayGroup>
);
```

## Rules

- Prefer local helper components over inline nested JSX when a block has a clear visual meaning.
- Preserve current behavior, state transitions, props, labels, colors, spacing, and icons unless the user asks for design changes.
- Keep Mantine layout values in the extracted display component that owns the layout.
- Avoid exporting helper components unless other files already import them or the user asks for shared components.
- Avoid broad abstraction files. This convention is local-file composition first.
- Keep names concrete and domain-specific, such as `SearchControlGroup`, `RecentButtonGroup`, and `UserButtonGroup`.
- Keep comments only when they explain file purpose or non-obvious behavior.

## Validation

After editing, run the repo's available checks for the touched file or project, usually:

```bash
npm run build
```

If a full build is too slow or blocked, inspect the changed JSX for missing imports, stale props, and unused helpers.
