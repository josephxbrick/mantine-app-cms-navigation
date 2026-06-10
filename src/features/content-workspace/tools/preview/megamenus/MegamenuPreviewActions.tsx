/*
 * File purpose: Preview Actions megamenu configuration for previewing, validating, and publishing actions.
 *
 * Imports:
 * - Stack from "@mantine/core" provides layout primitives used by the custom publishing controls.
 * - IconCalendar, IconHistory, IconLogin, IconRotate, IconRoute, IconTrash, IconUser, IconUsers, IconUserCircle, from "@tabler/icons-react" provides icon components or icon types used by the CMS navigation UI.
 * - useState from "react" provides local dropdown and publish scope state for action controls.
 * - MegamenuRenderer from "../../../megamenus/MegamenuRenderer" provides the shared renderer for configurable megamenu columns and items.
 * - MegamenuCommandItem, MegamenuCommandLabel from "../../../megamenus/MegamenuRenderer" provides the shared command row presentation for custom menu content.
 * - type { MegamenuConfig } from "../../../megamenus/types" provides the shared megamenu configuration and value types.
 * - ToolbarSelectMenu from "../../../toolbars/ToolbarSelectMenu" provides the custom dropdown with top label for publish target selection.
 */
import { Stack } from "@mantine/core";
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

const MARK_PAGE_COMMAND_ID = "preview-actions-mark-page";
const MARK_CHILDREN_COMMAND_ID =
  "preview-actions-mark-children";
const UNMARK_PAGE_COMMAND_ID =
  "preview-actions-unmark-page";
const UNMARK_CHILDREN_COMMAND_ID =
  "preview-actions-unmark-children";
const PUBLISH_PAGE_COMMAND_ID =
  "preview-actions-publish-page";
const PUBLISH_CHILDREN_COMMAND_ID =
  "preview-actions-publish-children";
const PUBLISH_SITE_COMMAND_ID =
  "preview-actions-publish-site";

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

const previewActionsColumns: MegamenuColumn[] = [
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
        options={publishTargetOptions}
        value={publishTarget}
        onChange={onChangePublishTarget}
        buttonWidth="100%"
        menuWidth="target"
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
          id: "preview-actions-mark-delimiter",
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

function getPreviewActionsMenu(
  publishingActionColumns: MegamenuColumn[]
): MegamenuConfig {
  return {
    id: "preview-actions",
    columns: [
      ...previewActionsColumns,
      ...publishingActionColumns,
    ],
  };
}

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

export default function MegamenuPreviewActions() {
  const [publishTarget, setPublishTarget] =
    useState("production");
  const publishingActionColumns =
    getPublishingActionColumns({
      publishTarget,
      onChangePublishTarget: setPublishTarget,
    });

  return (
    <MegamenuRenderer
      config={getPreviewActionsMenu(
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
