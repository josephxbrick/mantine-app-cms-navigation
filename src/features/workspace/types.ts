/*
 * Workspace domain contracts.
 * - Defines the major application domains selected from the left palette.
 * - Shared by shell, toolbars, and domain-specific workspace configuration.
 */
export type WorkspaceDomain =
  | "site"
  | "assets"
  | "ctp"
  | "administration"
  | "apps";

export type WorkspaceUtilityKey = string;
