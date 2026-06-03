/*
 * File purpose: Edit Publish megamenu configuration for publish, mark, advance, and workflow actions.
 *
 * Imports:
 * - IconCheck, IconChecks, IconFile, IconFiles, IconFolderCheck, IconHistory, IconLogin, IconRotate, from "@tabler/icons-react" provides icon components or icon types used by the CMS navigation UI.
 * - MegamenuRenderer from "../../../megamenus/MegamenuRenderer" provides the shared renderer for configurable megamenu columns and items.
 * - type { MegamenuConfig } from "../../../megamenus/types" provides the shared megamenu configuration and value types.
 */
import {
  IconCheck,
  IconChecks,
  IconFile,
  IconFiles,
  IconFolderCheck,
  IconHistory,
  IconLogin,
  IconRotate,
} from "@tabler/icons-react";

import { MegamenuRenderer } from "../../../megamenus/MegamenuRenderer";
import type { MegamenuConfig } from "../../../megamenus/types";

const publishMenu: MegamenuConfig = {
  id: "edit-publish",
  columns: [
    {
      id: "actions",
      header: "Actions",
      items: [
        {
          type: "command",
          id: "publish-check-in",
          label: "Check In",
          icon: IconLogin,
        },
        {
          type: "command",
          id: "publish-undo-checkout",
          label: "Undo Checkout",
          icon: IconRotate,
        },
        {
          type: "command",
          id: "publish-rollback",
          label: "Rollback",
          icon: IconHistory,
        },
      ],
    },
    {
      id: "mark-for-publish",
      header: "Mark for Publish",
      items: [
        {
          type: "command",
          id: "publish-mark-page",
          label: "Mark Page",
          icon: IconCheck,
        },
        {
          type: "command",
          id: "publish-mark-page-children",
          label: "Mark Page & Children",
          icon: IconChecks,
        },
      ],
    },
    {
      id: "publish",
      header: "Publish",
      items: [
        {
          type: "command",
          id: "publish-page",
          label: "Publish Page",
          icon: IconFile,
        },
        {
          type: "command",
          id: "publish-page-children",
          label: "Publish Page & Children",
          icon: IconFiles,
        },
        {
          type: "command",
          id: "publish-site",
          label: "Publish Site",
          icon: IconFolderCheck,
        },
      ],
    },
  ],
};

export default function MegamenuPublish() {
  return (
    <MegamenuRenderer
      config={publishMenu}
      radioValues={{}}
      checkboxValues={{}}
      onRadioChange={() => {}}
      onCheckboxChange={() => {}}
      onCommand={(itemId) => console.log(itemId)}
    />
  );
}
