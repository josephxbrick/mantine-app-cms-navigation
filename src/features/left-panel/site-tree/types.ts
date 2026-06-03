/*
 * File purpose: Shared type definitions for site and asset tree nodes.
 *
 * Imports:
 * - None; this file currently defines local types or constants without external dependencies.
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
