/*
 * View megamenu configuration.
 * - Defines ids and menu data for the View dropdown.
 * - Drives radio modes, checkbox toggles, and preview command rendering.
 */
import {
  IconAdjustmentsHorizontal,
  IconEye,
} from "@tabler/icons-react";

import type { MegamenuConfig } from "../../../megamenus/types";

export const EDIT_MODE_GROUP_ID = "edit-mode";

export const SHOW_FORM_INDEX_ID = "show-form-index";
export const SHOW_IN_CONTEXT_INDEX_ID = "show-in-context-index";
export const SHOW_PATH_ID = "show-path";

export const PREVIEW_OPTIONS_COMMAND_ID = "preview-options";
export const PREVIEW_COMMAND_ID = "preview";

export const editViewMenu: MegamenuConfig = {
  id: "edit-view",
  columns: [
    {
      id: "edit-modes",
      header: "Edit Modes",
      items: [
        {
          type: "radio",
          id: "index-mode",
          label: "Index Mode",
          groupId: EDIT_MODE_GROUP_ID,
          value: "Index Mode",
        },
        {
          type: "radio",
          id: "form-mode",
          label: "Form Mode",
          groupId: EDIT_MODE_GROUP_ID,
          value: "Form Mode",
        },
        {
          type: "radio",
          id: "in-context-mode",
          label: "In Context Mode",
          groupId: EDIT_MODE_GROUP_ID,
          value: "In Context Mode",
        },
      ],
    },
    {
      id: "form-options",
      slotId: "mode-options",
      header: "Form Options",
      visibleWhen: {
        source: "radio",
        radioGroupId: EDIT_MODE_GROUP_ID,
        value: "Form Mode",
      },
      items: [
        {
          type: "checkbox",
          id: SHOW_FORM_INDEX_ID,
          label: "Show Index",
        },
      ],
    },
    {
      id: "in-context-options",
      slotId: "mode-options",
      header: "In Context Options",
      visibleWhen: {
        source: "radio",
        radioGroupId: EDIT_MODE_GROUP_ID,
        value: "In Context Mode",
      },
      items: [
        {
          type: "checkbox",
          id: SHOW_IN_CONTEXT_INDEX_ID,
          label: "Show Index",
        },
        {
          type: "command",
          id: PREVIEW_OPTIONS_COMMAND_ID,
          label: "Preview Options",
          icon: IconAdjustmentsHorizontal,
        },
      ],
    },
    {
      id: "other-options",
      header: "Other Options",
      items: [
        {
          type: "checkbox",
          id: SHOW_PATH_ID,
          label: "Show Path",
        },
        {
          type: "command",
          id: PREVIEW_COMMAND_ID,
          label: "Preview",
          icon: IconEye,
        },
      ],
    },
  ],
};
