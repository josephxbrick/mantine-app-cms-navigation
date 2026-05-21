/*
 * Preview Advanced megamenu content.
 * - Renders environment, request data, and preview settings columns.
 * - Shares the selected preview device with the Preview View menu.
 */
import { MegamenuRenderer } from "../../../megamenus/MegamenuRenderer";
import type { MegamenuFieldValues } from "../../../megamenus/types";

import type { PreviewDevice } from "./PreviewDeviceColumn";
import {
  ADVANCED_DEVICE_ID,
  ADVANCED_INCLUDE_BROWSER_COOKIES_ID,
  ADVANCED_SHOW_ALL_PAGES_ID,
  previewAdvancedMenu,
} from "./advancedMenu";

type MegamenuPreviewAdvancedProps = {
  fieldValues: MegamenuFieldValues;
  onFieldChange: (itemId: string, value: string) => void;
  selectedDevice: PreviewDevice;
  onSelectDevice: (device: PreviewDevice) => void;
  includeBrowserCookies: boolean;
  onToggleIncludeBrowserCookies: () => void;
  showAllPages: boolean;
  onToggleShowAllPages: () => void;
};

export default function MegamenuPreviewAdvanced({
  fieldValues,
  onFieldChange,
  selectedDevice,
  onSelectDevice,
  includeBrowserCookies,
  onToggleIncludeBrowserCookies,
  showAllPages,
  onToggleShowAllPages,
}: MegamenuPreviewAdvancedProps) {
  const advancedFieldValues = {
    ...fieldValues,
    [ADVANCED_DEVICE_ID]: selectedDevice,
  };

  const handleFieldChange = (
    itemId: string,
    value: string
  ) => {
    if (itemId === ADVANCED_DEVICE_ID) {
      onSelectDevice(value as PreviewDevice);
      return;
    }

    onFieldChange(itemId, value);
  };

  const handleCheckboxChange = (itemId: string) => {
    if (itemId === ADVANCED_INCLUDE_BROWSER_COOKIES_ID) {
      onToggleIncludeBrowserCookies();
      return;
    }

    if (itemId === ADVANCED_SHOW_ALL_PAGES_ID) {
      onToggleShowAllPages();
    }
  };

  return (
    <MegamenuRenderer
      config={previewAdvancedMenu}
      radioValues={{}}
      checkboxValues={{
        [ADVANCED_INCLUDE_BROWSER_COOKIES_ID]:
          includeBrowserCookies,
        [ADVANCED_SHOW_ALL_PAGES_ID]: showAllPages,
      }}
      fieldValues={advancedFieldValues}
      onRadioChange={() => {}}
      onCheckboxChange={handleCheckboxChange}
      onFieldChange={handleFieldChange}
      onCommand={() => {}}
    />
  );
}
