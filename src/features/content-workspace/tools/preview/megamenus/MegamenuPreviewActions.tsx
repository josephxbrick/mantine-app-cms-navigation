/*
 * File purpose: Preview Actions megamenu configuration for previewing, validating, and publishing actions.
 *
 * Imports:
 * - IconCalendar, IconHistory, IconLogin, IconRotate, IconRoute, IconTrash, IconUser, IconUsers, IconUserCircle, from "@tabler/icons-react" provides icon components or icon types used by the CMS navigation UI.
 * - MegamenuRenderer from "../../../megamenus/MegamenuRenderer" provides the shared renderer for configurable megamenu columns and items.
 * - type { MegamenuConfig } from "../../../megamenus/types" provides the shared megamenu configuration and value types.
 */
import {
  IconCalendar,
  IconHistory,
  IconLogin,
  IconRotate,
  IconRoute,
  IconTrash,
  IconUser,
  IconUsers,
  IconUserCircle,
} from "@tabler/icons-react";

import { MegamenuRenderer } from "../../../megamenus/MegamenuRenderer";
import type { MegamenuConfig } from "../../../megamenus/types";

const previewActionsMenu: MegamenuConfig = {
  id: "preview-actions",
  columns: [
    {
      id: "assign-to",
      header: "Assign To",
      items: [
        {
          type: "command",
          id: "preview-actions-assign-me",
          label: "Me",
          icon: IconUserCircle,
        },
        {
          type: "command",
          id: "preview-actions-assign-user",
          label: "User...",
          icon: IconUser,
        },
        {
          type: "command",
          id: "preview-actions-assign-group",
          label: "Group...",
          icon: IconUsers,
        },
      ],
    },
    {
      id: "workflow",
      header: "Workflow",
      items: [
        {
          type: "command",
          id: "preview-actions-advance",
          label: "Advance",
          icon: IconRoute,
        },
        {
          type: "command",
          id: "preview-actions-remove-workflow",
          label: "Remove from Workflow",
          icon: IconTrash,
        },
        {
          type: "command",
          id: "preview-actions-workflow-history",
          label: "Show Workflow History",
          icon: IconCalendar,
        },
      ],
    },
    {
      id: "versioning",
      header: "Versioning",
      items: [
        {
          type: "command",
          id: "preview-actions-check-in",
          label: "Check In",
          icon: IconLogin,
        },
        {
          type: "command",
          id: "preview-actions-undo-checkout",
          label: "Undo Checkout",
          icon: IconRotate,
        },
        {
          type: "command",
          id: "preview-actions-rollback",
          label: "Rollback",
          icon: IconHistory,
        },
      ],
    },
  ],
};

const commandMessages: Record<string, string> = {
  "preview-actions-assign-me": "Assign to Me",
  "preview-actions-assign-user": "Assign to User",
  "preview-actions-assign-group": "Assign to Group",
  "preview-actions-advance": "Advance",
  "preview-actions-remove-workflow":
    "Remove from Workflow",
  "preview-actions-workflow-history":
    "Show Workflow History",
  "preview-actions-check-in": "Check In",
  "preview-actions-undo-checkout": "Undo Checkout",
  "preview-actions-rollback": "Rollback",
};

export default function MegamenuPreviewActions() {
  return (
    <MegamenuRenderer
      config={previewActionsMenu}
      radioValues={{}}
      checkboxValues={{}}
      onRadioChange={() => {}}
      onCheckboxChange={() => {}}
      onCommand={(itemId) =>
        console.log(commandMessages[itemId] ?? itemId)
      }
    />
  );
}
