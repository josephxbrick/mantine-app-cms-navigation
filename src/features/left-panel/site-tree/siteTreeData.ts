/*
 * File purpose: Prototype site and asset tree data plus lookup helpers for selection and expansion.
 *
 * Imports:
 * - type { SiteTreeNode } from "./types" provides shared data types used by this feature.
 */
import type { SiteTreeNode } from "./types";

export const editTreeData: SiteTreeNode[] = [
  {
    id: "ingeniux",
    label: "Ingeniux CMS",
    xId: "x100",
    children: [
      {
        id: "central-university",
        label: "Central University",
        xId: "x101",
        children: [
          {
            id: "about",
            label: "About",
            xId: "x102",
            children: [
              {
                id: "leadership",
                label: "Leadership",
                xId: "x103",
              },
              {
                id: "history",
                label: "History",
                xId: "x104",
              },
              {
                id: "campus-map",
                label: "Campus Map",
                xId: "x105",
              },
            ],
          },
          {
            id: "admissions",
            label: "Admissions",
            xId: "x106",
            children: [
              {
                id: "undergraduate",
                label: "Undergraduate",
                xId: "x107",
              },
              {
                id: "graduate",
                label: "Graduate",
                xId: "x108",
              },
              {
                id: "tuition-aid",
                label: "Tuition & Financial Aid",
                xId: "x109",
              },
            ],
          },
          {
            id: "academics",
            label: "Academics",
            xId: "x110",
            children: [
              {
                id: "colleges-schools",
                label: "Colleges & Schools",
                xId: "x111",
              },
              {
                id: "programs",
                label: "Programs",
                xId: "x112",
              },
              {
                id: "library",
                label: "Library",
                xId: "x113",
              },
            ],
          },
          {
            id: "student-life",
            label: "Student Life",
            xId: "x114",
            children: [
              {
                id: "housing",
                label: "Housing",
                xId: "x115",
                children: [
                  {
                    id: "residence-halls",
                    label: "Residence Halls",
                    xId: "x116",
                  },
                  {
                    id: "apply-for-housing",
                    label: "Apply for Housing",
                    xId: "x117",
                  },
                  {
                    id: "housing-rates",
                    label: "Housing Rates",
                    xId: "x118",
                  },
                  {
                    id: "move-in-info",
                    label: "Move-In Information",
                    xId: "x119",
                  },
                  {
                    id: "resident-resources",
                    label: "Resident Resources",
                    xId: "x120",
                  },
                ],
              },
              {
                id: "clubs-orgs",
                label: "Clubs & Organizations",
                xId: "x121",
              },
              {
                id: "dining",
                label: "Dining",
                xId: "x122",
              },
            ],
          },
          {
            id: "athletics",
            label: "Athletics",
            xId: "x123",
            children: [
              {
                id: "mens-sports",
                label: "Men’s Sports",
                xId: "x124",
              },
              {
                id: "womens-sports",
                label: "Women’s Sports",
                xId: "x125",
              },
              {
                id: "tickets",
                label: "Tickets",
                xId: "x126",
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
