/*
 * File purpose: Shared primary-toolbar tool and selection types.
 *
 * Imports:
 * - type { ReactNode } from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 */
import type { ReactNode } from "react";

export type ToolKey = string;
export type SelectedToolKey = ToolKey | null;

export type ToolbarTool = {
  label: ToolKey;
  icon: ReactNode;
};
