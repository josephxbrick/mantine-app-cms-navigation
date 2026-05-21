/*
 * Left-panel tree sample data.
 * - Provides separate hierarchical nodes for content and asset workspaces.
 * - Includes a helper for resolving the selected node by id.
 */
import type { SiteTreeNode } from "./types";

export const editTreeData: SiteTreeNode[] = [
  {
    id: "ingeniux",
    label: "Ingeniux CMS",
    children: [
      {
        id: "central-university",
        label: "Central University",
        children: [
          {
            id: "about",
            label: "About",
            children: [
              {
                id: "leadership",
                label: "Leadership",
              },
              {
                id: "history",
                label: "History",
              },
              {
                id: "campus-map",
                label: "Campus Map",
              },
            ],
          },
          {
            id: "admissions",
            label: "Admissions",
            children: [
              {
                id: "undergraduate",
                label: "Undergraduate",
              },
              {
                id: "graduate",
                label: "Graduate",
              },
              {
                id: "tuition-aid",
                label: "Tuition & Financial Aid",
              },
            ],
          },
          {
            id: "academics",
            label: "Academics",
            children: [
              {
                id: "colleges-schools",
                label: "Colleges & Schools",
              },
              {
                id: "programs",
                label: "Programs",
              },
              {
                id: "library",
                label: "Library",
              },
            ],
          },
          {
            id: "student-life",
            label: "Student Life",
            children: [
              {
                id: "housing",
                label: "Housing",
                children: [
                  {
                    id: "residence-halls",
                    label: "Residence Halls",
                  },
                  {
                    id: "apply-for-housing",
                    label: "Apply for Housing",
                  },
                  {
                    id: "housing-rates",
                    label: "Housing Rates",
                  },
                  {
                    id: "move-in-info",
                    label: "Move-In Information",
                  },
                  {
                    id: "resident-resources",
                    label: "Resident Resources",
                  },
                ],
              },
              {
                id: "clubs-orgs",
                label: "Clubs & Organizations",
              },
              {
                id: "dining",
                label: "Dining",
              },
            ],
          },
          {
            id: "athletics",
            label: "Athletics",
            children: [
              {
                id: "mens-sports",
                label: "Men’s Sports",
              },
              {
                id: "womens-sports",
                label: "Women’s Sports",
              },
              {
                id: "tickets",
                label: "Tickets",
              },
            ],
          },
        ],
      },
    ],
  },
];

export const assetsTreeData: SiteTreeNode[] = [
  {
    id: "asset-library",
    label: "Asset Library",
    children: [
      {
        id: "images",
        label: "Images",
        icon: "image",
        children: [
          {
            id: "campus-hero.png",
            label: "campus-hero.png",
            icon: "image",
          },
          {
            id: "student-union.png",
            label: "student-union.png",
            icon: "image",
          },
          {
            id: "faculty-headshot-kim.png",
            icon: "image",
            label: "faculty-headshot-kim.png",
          },
        ],
      },
      {
        id: "documents",
        label: "Documents",
        icon: "document",
        children: [
          {
            id: "undergraduate-application.pdf",
            label: "undergraduate-application.pdf",
            icon: "document",
          },
          {
            id: "student-handbook.pdf",
            label: "student-handbook.pdf",
            icon: "document",
          },
          {
            id: "annual-report-2026.pdf",
            label: "annual-report-2026.pdf",
            icon: "document",
          },
        ],
      },
      {
        id: "video",
        label: "Video",
        icon: "video",
        children: [
          {
            id: "campus-tour.mp4",
            label: "campus-tour.mp4",
            icon: "video",
          },
          {
            id: "student-story-amelia.mp4",
            label: "student-story-amelia.mp4",
            icon: "video",
          },
        ],
      },
      {
        id: "shared-assets",
        label: "Shared Assets",
        icon: "asset",
        children: [
          {
            id: "university-logo.svg",
            label: "university-logo.svg",
            icon: "image",
          },
          {
            id: "site-icons.zip",
            label: "site-icons.zip",
            icon: "asset",
          },
          {
            id: "brand-presentation-template.pptx",
            label: "brand-presentation-template.pptx",
            icon: "document",
          },
        ],
      },
    ],
  },
];

export const siteTreeData = editTreeData;

export function findTreeNodeById(
  nodeId: string | null,
  nodes: SiteTreeNode[]
): SiteTreeNode | null {
  if (!nodeId) {
    return null;
  }

  for (const node of nodes) {
    if (node.id === nodeId) {
      return node;
    }

    const childMatch = findTreeNodeById(
      nodeId,
      node.children ?? []
    );

    if (childMatch) {
      return childMatch;
    }
  }

  return null;
}

export function findTreeNodePathIds(
  nodeId: string | null,
  nodes: SiteTreeNode[],
  path: string[] = []
): string[] {
  if (!nodeId) {
    return [];
  }

  for (const node of nodes) {
    const nodePath = [...path, node.id];

    if (node.id === nodeId) {
      return nodePath;
    }

    const childPath = findTreeNodePathIds(
      nodeId,
      node.children ?? [],
      nodePath
    );

    if (childPath.length) {
      return childPath;
    }
  }

  return [];
}

export function getTreeNodeIdsToOpen(
  nodeId: string | null,
  nodes: SiteTreeNode[]
): string[] {
  return findTreeNodePathIds(nodeId, nodes).slice(0, -1);
}

export function findSiteTreeNodeById(
  nodeId: string | null,
  nodes: SiteTreeNode[] = siteTreeData
): SiteTreeNode | null {
  return findTreeNodeById(nodeId, nodes);
}
