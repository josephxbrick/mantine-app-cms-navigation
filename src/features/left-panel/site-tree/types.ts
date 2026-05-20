/*
 * Site tree data contracts.
 * - Defines the recursive node shape used by the tree data and row renderer.
 * - Keeps tree data typing shared across the left panel.
 */
export type SiteTreeNodeType = "folder" | "page";

export type SiteTreeNode = {
  id: string;
  label: string;
  type?: SiteTreeNodeType;
  children?: SiteTreeNode[];
};
