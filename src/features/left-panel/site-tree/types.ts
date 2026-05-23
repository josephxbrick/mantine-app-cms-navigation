/*
 * Site tree data contracts.
 * - Defines the recursive node shape used by tree data and row renderers.
 * - Keeps tree data typing shared across the left panel.
 */
export type SiteTreeNodeType = "folder" | "page";

export type SiteTreeNodeIconKey =
  | "folder"
  | "page"
  | "image"
  | "document"
  | "video"
  | "asset";

export type SiteTreeNode = {
  id: string;
  label: string;
  xId?: string;
  type?: SiteTreeNodeType;
  icon?: SiteTreeNodeIconKey;
  children?: SiteTreeNode[];
};
