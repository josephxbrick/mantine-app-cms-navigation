/*
 * File purpose: Edit View megamenu wrapper that renders view options through the generic renderer.
 *
 * Imports:
 * - MegamenuRenderer from "../../../megamenus/MegamenuRenderer" provides the shared renderer for configurable megamenu columns and items.
 * - EDIT_MODE_GROUP_ID, PREVIEW_OPTIONS_COMMAND_ID, SHOW_FORM_INDEX_ID, SHOW_IN_CONTEXT_INDEX_ID, SHOW_PATH_ID, editViewMenu, from "./viewMenu" provides Edit View menu configuration and option identifiers.
 */
import { MegamenuRenderer } from "../../../megamenus/MegamenuRenderer";

import {
  EDIT_MODE_GROUP_ID,
  PREVIEW_OPTIONS_COMMAND_ID,
  SHOW_FORM_INDEX_ID,
  SHOW_IN_CONTEXT_INDEX_ID,
  SHOW_PATH_ID,
  editViewMenu,
} from "./viewMenu";

type EditMode =
  | "Index Mode"
  | "Form Mode"
  | "In Context Mode";

type MegamenuViewProps = {
  selectedMode: EditMode;
  onSelectMode: (mode: EditMode) => void;
  showFormIndex: boolean;
  onToggleFormIndex: () => void;
  showInContextIndex: boolean;
  onToggleInContextIndex: () => void;
  showPath: boolean;
  onToggleShowPath: () => void;
};

export default function MegamenuView({
  selectedMode,
  onSelectMode,
  showFormIndex,
  onToggleFormIndex,
  showInContextIndex,
  onToggleInContextIndex,
  showPath,
  onToggleShowPath,
}: MegamenuViewProps) {
  const megamenuRendererProps = {
    config: editViewMenu,
    radioValues: {
      [EDIT_MODE_GROUP_ID]: selectedMode,
    },
    checkboxValues: {
      [SHOW_FORM_INDEX_ID]: showFormIndex,
      [SHOW_IN_CONTEXT_INDEX_ID]: showInContextIndex,
      [SHOW_PATH_ID]: showPath,
    },
    onRadioChange: (_: string, value: string) =>
      onSelectMode(value as EditMode),
    onCheckboxChange: (itemId: string) => {
      if (itemId === SHOW_FORM_INDEX_ID) {
        onToggleFormIndex();
        return;
      }

      if (itemId === SHOW_IN_CONTEXT_INDEX_ID) {
        onToggleInContextIndex();
        return;
      }

      if (itemId === SHOW_PATH_ID) {
        onToggleShowPath();
      }
    },
    onCommand: (itemId: string) => {
      if (itemId === PREVIEW_OPTIONS_COMMAND_ID) {
        console.log("Preview Options");
      }
    },
  };

  return (
    <MegamenuRenderer {...megamenuRendererProps} />
  );
}
