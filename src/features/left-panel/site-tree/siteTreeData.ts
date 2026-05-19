import type { SiteTreeNode } from "./types";

export const siteTreeData: SiteTreeNode[] = [
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

export function findSiteTreeNodeById(
  nodeId: string | null,
  nodes: SiteTreeNode[] = siteTreeData
): SiteTreeNode | null {
  if (!nodeId) {
    return null;
  }

  for (const node of nodes) {
    if (node.id === nodeId) {
      return node;
    }

    const childMatch = findSiteTreeNodeById(
      nodeId,
      node.children ?? []
    );

    if (childMatch) {
      return childMatch;
    }
  }

  return null;
}
