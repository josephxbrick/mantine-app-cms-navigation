/*
 * Primary toolbar data contracts.
 * - Defines the available content-tool keys and toolbar tool shape.
 * - Shared by the primary toolbar and its paper control.
 */
import type { ReactNode } from "react";

export type ToolKey =
  | "Edit"
  | "Assets"
  | "Preview"
  | "Categorize"
  | "History"
  | "XML"
  | "Properties"
  | "Analytics"
  | "Accessibility";

export type ToolbarTool = {
  label: ToolKey;
  icon: ReactNode;
};
