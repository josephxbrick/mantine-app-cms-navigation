/*
 * New megamenu content.
 * - Defines create-new options for content and other item types for the shared renderer.
 * - Provides the visual menu options; creation behavior is not implemented yet.
 */
import {
  IconAtom,
  IconFile,
  IconFolder,
  IconMap,
} from "@tabler/icons-react";

import { MegamenuRenderer } from "../../../megamenus/MegamenuRenderer";
import type { MegamenuConfig } from "../../../megamenus/types";

const newMenu: MegamenuConfig = {
  id: "edit-new",
  columns: [
    {
      id: "content",
      header: "Content",
      items: [
        {
          type: "command",
          id: "new-page",
          label: "Page",
          icon: IconFile,
        },
        {
          type: "command",
          id: "new-component",
          label: "Component",
          icon: IconAtom,
        },
      ],
    },
    {
      id: "other",
      header: "Other",
      items: [
        {
          type: "command",
          id: "new-folder",
          label: "Folder",
          icon: IconFolder,
        },
        {
          type: "command",
          id: "new-dita-alias",
          label: "DITA Alias",
          icon: IconMap,
        },
      ],
    },
  ],
};

export default function MegamenuNew() {
  return (
    <MegamenuRenderer
      config={newMenu}
      radioValues={{}}
      checkboxValues={{}}
      onRadioChange={() => {}}
      onCheckboxChange={() => {}}
      onCommand={(itemId) => console.log(itemId)}
    />
  );
}
