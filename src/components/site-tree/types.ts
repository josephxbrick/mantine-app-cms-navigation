export type SiteTreeNodeType = "folder" | "page";

export type SiteTreeNode = {
  id: string;
  label: string;
  type: SiteTreeNodeType;
  children?: SiteTreeNode[];
};