/*
 * Primary toolbar data contracts.
 * - Defines content-tool keys and toolbar tool shape.
 * - Shared by the primary toolbar and its paper control.
 */
import type { ReactNode } from "react";

export type ToolKey = string;
export type SelectedToolKey = ToolKey | null;

export type ToolbarTool = {
  label: ToolKey;
  icon: ReactNode;
};
