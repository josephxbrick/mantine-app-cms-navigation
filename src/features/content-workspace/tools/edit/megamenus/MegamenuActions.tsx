/*
 * Actions megamenu content.
 * - Defines Page, Assign To, and Workflow action columns for the shared renderer.
 * - Currently wires actions to placeholder console logging.
 */
import {
  IconCalendar,
  IconDeviceFloppy,
  IconPencilCheck,
  IconRoute,
  IconTrash,
  IconUser,
  IconUsers,
  IconUserCircle,
} from "@tabler/icons-react";

import { MegamenuRenderer } from "../../../megamenus/MegamenuRenderer";
import type {
  MegamenuColumn,
  MegamenuConfig,
} from "../../../megamenus/types";

const SAVE_COMMAND_ID = "edit-actions-save";
const RENAME_COMMAND_ID = "edit-actions-rename";
const DELETE_COMMAND_ID = "edit-actions-delete";
const ASSIGN_ME_COMMAND_ID = "edit-actions-assign-me";
const ASSIGN_USER_COMMAND_ID =
  "edit-actions-assign-user";
const ASSIGN_GROUP_COMMAND_ID =
  "edit-actions-assign-group";
const ADVANCE_COMMAND_ID = "edit-actions-advance";
const REMOVE_WORKFLOW_COMMAND_ID =
  "edit-actions-remove-workflow";
const WORKFLOW_HISTORY_COMMAND_ID =
  "edit-actions-workflow-history";

const actionColumns: MegamenuColumn[] = [
  {
    id: "page",
    header: "Page",
    items: [
      {
        type: "command",
        id: SAVE_COMMAND_ID,
        label: "Save",
        icon: IconDeviceFloppy,
      },
      {
        type: "command",
        id: RENAME_COMMAND_ID,
        label: "Rename...",
        icon: IconPencilCheck,
      },
      {
        type: "command",
        id: DELETE_COMMAND_ID,
        label: "Delete",
        icon: IconTrash,
      },
    ],
  },
  {
    id: "assign-to",
    header: "Assign To",
    items: [
      {
        type: "command",
        id: ASSIGN_ME_COMMAND_ID,
        label: "Me",
        icon: IconUserCircle,
      },
      {
        type: "command",
        id: ASSIGN_USER_COMMAND_ID,
        label: "User...",
        icon: IconUser,
      },
      {
        type: "command",
        id: ASSIGN_GROUP_COMMAND_ID,
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
        id: ADVANCE_COMMAND_ID,
        label: "Advance",
        icon: IconRoute,
      },
      {
        type: "command",
        id: REMOVE_WORKFLOW_COMMAND_ID,
        label: "Remove from Workflow",
        icon: IconTrash,
      },
      {
        type: "command",
        id: WORKFLOW_HISTORY_COMMAND_ID,
        label: "Show Workflow History",
        icon: IconCalendar,
      },
    ],
  },
];

const commandMessages: Record<string, string> = {
  [SAVE_COMMAND_ID]: "Save",
  [RENAME_COMMAND_ID]: "Rename",
  [DELETE_COMMAND_ID]: "Delete",
  [ASSIGN_ME_COMMAND_ID]: "Assign to Me",
  [ASSIGN_USER_COMMAND_ID]: "Assign to User",
  [ASSIGN_GROUP_COMMAND_ID]: "Assign to Group",
  [ADVANCE_COMMAND_ID]: "Advance",
  [REMOVE_WORKFLOW_COMMAND_ID]: "Remove from Workflow",
  [WORKFLOW_HISTORY_COMMAND_ID]: "Show Workflow History",
};

type MegamenuActionsProps = {
  hideSave?: boolean;
};

function getActionConfig(
  hideSave: boolean
): MegamenuConfig {
  const columns = hideSave
    ? actionColumns.map((column) =>
        column.id === "page"
          ? {
              ...column,
              items: column.items.filter(
                (item) => item.id !== SAVE_COMMAND_ID
              ),
            }
          : column
      )
    : actionColumns;

  return {
    id: "edit-actions",
    columns,
  };
}

export default function MegamenuActions({
  hideSave = false,
}: MegamenuActionsProps) {
  return (
    <MegamenuRenderer
      config={getActionConfig(hideSave)}
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
