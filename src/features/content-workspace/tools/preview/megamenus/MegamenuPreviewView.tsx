/*
 * Preview view megamenu content.
 * - Defines preview device selection and preview commands for the shared renderer.
 * - Tracks the selected preview device through caller-owned state.
 */
import { IconExternalLink } from "@tabler/icons-react";

import { MegamenuRenderer } from "../../../megamenus/MegamenuRenderer";
import type { MegamenuConfig } from "../../../megamenus/types";

import type { PreviewDevice } from "./PreviewDeviceColumn";

const PREVIEW_DEVICE_GROUP_ID =
  "preview-view-device";
const VIEW_IN_BROWSER_COMMAND_ID =
  "preview-view-in-browser";

const previewViewMenu: MegamenuConfig = {
  id: "preview-view",
  columns: [
    {
      id: "form-factors",
      header: "Form Factors",
      items: [
        {
          type: "radio",
          id: "preview-view-device-desktop",
          label: "Desktop",
          groupId: PREVIEW_DEVICE_GROUP_ID,
          value: "Desktop",
        },
        {
          type: "radio",
          id: "preview-view-device-tablet",
          label: "Tablet",
          groupId: PREVIEW_DEVICE_GROUP_ID,
          value: "Tablet",
        },
        {
          type: "radio",
          id: "preview-view-device-mobile",
          label: "Mobile",
          groupId: PREVIEW_DEVICE_GROUP_ID,
          value: "Mobile",
        },
      ],
    },
    {
      id: "preview",
      header: "Preview",
      items: [
        {
          type: "command",
          id: VIEW_IN_BROWSER_COMMAND_ID,
          label: "View in New Browser Window",
          icon: IconExternalLink,
        },
      ],
    },
  ],
};

type MegamenuPreviewViewProps = {
  selectedDevice: PreviewDevice;
  onSelectDevice: (device: PreviewDevice) => void;
};

export default function MegamenuPreviewView({
  selectedDevice,
  onSelectDevice,
}: MegamenuPreviewViewProps) {
  return (
    <MegamenuRenderer
      config={previewViewMenu}
      radioValues={{
        [PREVIEW_DEVICE_GROUP_ID]: selectedDevice,
      }}
      checkboxValues={{}}
      onRadioChange={(_, value) =>
        onSelectDevice(value as PreviewDevice)
      }
      onCheckboxChange={() => {}}
      onCommand={(itemId) => {
        if (itemId === VIEW_IN_BROWSER_COMMAND_ID) {
          console.log("View in New Browser Window");
        }
      }}
    />
  );
}
