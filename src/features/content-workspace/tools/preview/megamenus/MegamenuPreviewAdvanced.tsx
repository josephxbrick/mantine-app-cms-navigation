/*
 * File purpose: Preview Advanced megamenu wrapper that wires advanced field values into the generic renderer.
 *
 * Imports:
 * - MegamenuRenderer from "../../../megamenus/MegamenuRenderer" provides the shared renderer for configurable megamenu columns and items.
 * - type { MegamenuFieldValues } from "../../../megamenus/types" provides the shared megamenu configuration and value types.
 * - type { PreviewDevice } from "./PreviewDeviceColumn" provides the shared Preview device type.
 * - ADVANCED_DEVICE_ID, ADVANCED_INCLUDE_BROWSER_COOKIES_ID, ADVANCED_SHOW_ALL_PAGES_ID, previewAdvancedMenu, from "./advancedMenu" provides Preview Advanced menu configuration and field identifiers.
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
