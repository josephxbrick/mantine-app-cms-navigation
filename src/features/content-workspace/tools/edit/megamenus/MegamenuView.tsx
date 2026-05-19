import { MegamenuRenderer } from "../../../megamenus/MegamenuRenderer";

import {
  EDIT_MODE_GROUP_ID,
  PREVIEW_COMMAND_ID,
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
  return (
    <MegamenuRenderer
      config={editViewMenu}
      radioValues={{
        [EDIT_MODE_GROUP_ID]: selectedMode,
      }}
      checkboxValues={{
        [SHOW_FORM_INDEX_ID]: showFormIndex,
        [SHOW_IN_CONTEXT_INDEX_ID]: showInContextIndex,
        [SHOW_PATH_ID]: showPath,
      }}
      onRadioChange={(_, value) =>
        onSelectMode(value as EditMode)
      }
      onCheckboxChange={(itemId) => {
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
      }}
      onCommand={(itemId) => {
        if (itemId === PREVIEW_OPTIONS_COMMAND_ID) {
          console.log("Preview Options");
          return;
        }

        if (itemId === PREVIEW_COMMAND_ID) {
          console.log("Preview");
        }
      }}
    />
  );
}
