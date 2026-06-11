/*
 * File purpose: Edit Actions megamenu configuration for save, reload, copy, move, delete, and validation actions.
 *
 * Imports:
 * - Stack from "@mantine/core" provides layout primitives used by the custom publishing controls.
 * - IconCalendar, IconDeviceFloppy, IconHistory, IconLogin, IconPencilCheck, IconRotate, IconRoute, IconTrash, IconUser, IconUsers, IconUserCircle, from "@tabler/icons-react" provides icon components or icon types used by the CMS navigation UI.
 * - useState from "react" provides local dropdown and publish scope state for action controls.
 * - MegamenuRenderer from "../../../megamenus/MegamenuRenderer" provides the shared renderer for configurable megamenu columns and items.
 * - MegamenuCommandItem, MegamenuCommandLabel from "../../../megamenus/MegamenuRenderer" provides the shared command row presentation for custom menu content.
 * - type { MegamenuColumn, MegamenuConfig, } from "../../../megamenus/types" provides the shared megamenu configuration and value types.
 * - ToolbarSelectMenu from "../../../toolbars/ToolbarSelectMenu" provides the custom dropdown with top label for publish target selection.
 */
import { Stack } from "@mantine/core";
import {
  IconCalendar,
  IconDeviceFloppy,
  IconHistory,
  IconLogin,
  IconPencilCheck,
  IconRotate,
  IconRoute,
  IconTrash,
  IconUser,
  IconUsers,
  IconUserCircle,
} from "@tabler/icons-react";
import { useState } from "react";

import {
  MegamenuCommandItem,
  MegamenuCommandLabel,
  MegamenuRenderer,
} from "../../../megamenus/MegamenuRenderer";
import type {
  MegamenuColumn,
  MegamenuConfig,
} from "../../../megamenus/types";
import { ToolbarSelectMenu } from "../../../toolbars/ToolbarSelectMenu";

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
const CHECK_IN_COMMAND_ID = "edit-actions-check-in";
const UNDO_CHECKOUT_COMMAND_ID =
  "edit-actions-undo-checkout";
const ROLLBACK_COMMAND_ID = "edit-actions-rollback";
const MARK_PAGE_COMMAND_ID = "edit-actions-mark-page";
const MARK_CHILDREN_COMMAND_ID =
  "edit-actions-mark-children";
const UNMARK_PAGE_COMMAND_ID =
  "edit-actions-unmark-page";
const UNMARK_CHILDREN_COMMAND_ID =
  "edit-actions-unmark-children";
const PUBLISH_PAGE_COMMAND_ID = "edit-actions-publish-page";
const PUBLISH_CHILDREN_COMMAND_ID =
  "edit-actions-publish-children";
const PUBLISH_SITE_COMMAND_ID = "edit-actions-publish-site";

const publishTargetOptions = [
  {
    value: "qa",
    label: "QA",
  },
  {
    value: "staging",
    label: "Staging",
  },
  {
    value: "production",
    label: "Production",
  },
];

const publishScopeOptions = [
  {
    id: PUBLISH_PAGE_COMMAND_ID,
    label: "Publish this page",
  },
  {
    id: PUBLISH_CHILDREN_COMMAND_ID,
    label: "Publish this page & its children",
  },
  {
    id: PUBLISH_SITE_COMMAND_ID,
    label: "Publish site",
  },
];

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
  {
    id: "publishing-actions",
    header: "Versioning",
    items: [
      {
        type: "command",
        id: CHECK_IN_COMMAND_ID,
        label: "Check In",
        icon: IconLogin,
      },
      {
        type: "command",
        id: UNDO_CHECKOUT_COMMAND_ID,
        label: "Undo Checkout",
        icon: IconRotate,
      },
      {
        type: "command",
        id: ROLLBACK_COMMAND_ID,
        label: "Rollback",
        icon: IconHistory,
      },
    ],
  },
];

type PublishToTargetColumnProps = {
  publishTarget: string;
  onChangePublishTarget: (value: string) => void;
};

function PublishToTargetColumn({
  publishTarget,
  onChangePublishTarget,
}: PublishToTargetColumnProps) {
  return (
    <Stack gap="sm">
      <ToolbarSelectMenu
        label="Publishing Target"
        labelSize="md"
        options={publishTargetOptions}
        value={publishTarget}
        onChange={onChangePublishTarget}
        mode="dropdown-only"
        buttonWidth="100%"
        menuWidth="target"
        pillFill="white"
        pillStroke="1px solid var(--mantine-color-asxGray-4)"
        showTriggerIcon={false}
        showMenuIcons={false}
        withinPortal={false}
      />
      <Stack gap={4}>
        {publishScopeOptions.map((option) => (
          <MegamenuCommandItem
            key={option.id}
            onClick={() =>
              console.log(
                commandMessages[option.id] ?? option.id
              )
            }
          >
            <MegamenuCommandLabel>
              {option.label}
            </MegamenuCommandLabel>
          </MegamenuCommandItem>
        ))}
      </Stack>
    </Stack>
  );
}

function getPublishingActionColumns({
  publishTarget,
  onChangePublishTarget,
}: PublishToTargetColumnProps): MegamenuColumn[] {
  return [
    {
      id: "mark-for-publish",
      header: "Mark for Publish",
      items: [
        {
          type: "command",
          id: MARK_PAGE_COMMAND_ID,
          label: "This page",
        },
        {
          type: "command",
          id: MARK_CHILDREN_COMMAND_ID,
          label: "Mark this page & its children",
        },
        {
          type: "delimiter",
          id: "edit-actions-mark-delimiter",
        },
        {
          type: "command",
          id: UNMARK_PAGE_COMMAND_ID,
          label: "Unmark this page",
        },
        {
          type: "command",
          id: UNMARK_CHILDREN_COMMAND_ID,
          label: "Unmark this page & its children",
        },
      ],
    },
    {
      id: "publish-to-target",
      header: "Publish",
      items: publishScopeOptions.map((option) => ({
        type: "command",
        id: option.id,
        label: option.label,
      })),
      content: (
        <PublishToTargetColumn
          publishTarget={publishTarget}
          onChangePublishTarget={onChangePublishTarget}
        />
      ),
    },
  ];
}

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
  [CHECK_IN_COMMAND_ID]: "Check In",
  [UNDO_CHECKOUT_COMMAND_ID]: "Undo Checkout",
  [ROLLBACK_COMMAND_ID]: "Rollback",
  [MARK_PAGE_COMMAND_ID]: "Mark Page for Publish",
  [MARK_CHILDREN_COMMAND_ID]:
    "Mark Page and Children for Publish",
  [UNMARK_PAGE_COMMAND_ID]: "Unmark Page for Publish",
  [UNMARK_CHILDREN_COMMAND_ID]:
    "Unmark Page and Children for Publish",
  [PUBLISH_PAGE_COMMAND_ID]: "Publish Page",
  [PUBLISH_CHILDREN_COMMAND_ID]:
    "Publish Page and Children",
  [PUBLISH_SITE_COMMAND_ID]: "Publish Site",
};

type MegamenuActionsProps = {
  hideSave?: boolean;
};

function getActionConfig(
  hideSave: boolean,
  publishingActionColumns: MegamenuColumn[]
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
    columns: [...columns, ...publishingActionColumns],
  };
}

export default function MegamenuActions({
  hideSave = false,
}: MegamenuActionsProps) {
  const [publishTarget, setPublishTarget] =
    useState("production");
  const publishingActionColumns =
    getPublishingActionColumns({
      publishTarget,
      onChangePublishTarget: setPublishTarget,
    });

  return (
    <MegamenuRenderer
      config={getActionConfig(
        hideSave,
        publishingActionColumns
      )}
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
