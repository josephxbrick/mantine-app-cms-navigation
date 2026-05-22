/*
 * Preview actions megamenu content.
 * - Mirrors Edit Actions without Page-specific commands.
 * - Currently wires actions to placeholder console logging.
 */
import {
  IconCalendar,
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
