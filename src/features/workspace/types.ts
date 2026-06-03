/*
 * File purpose: Shared workspace domain and utility key types used across shell navigation.
 *
 * Imports:
 * - None; this file currently defines local types or constants without external dependencies.
 */
export type WorkspaceDomain =
  | "dashboard"
  | "site"
  | "assets"
  | "ctp"
  | "administration"
  | "apps";

export type WorkspaceUtilityKey = string;
