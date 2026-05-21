/*
 * Workspace domain contracts.
 * - Defines the major application domains selected from the product toolbar.
 * - Shared by shell, toolbars, and domain-specific workspace configuration.
 */
export type WorkspaceDomain =
  | "dashboard"
  | "site"
  | "assets"
  | "ctp"
  | "administration"
  | "apps";

export type WorkspaceUtilityKey = string;
