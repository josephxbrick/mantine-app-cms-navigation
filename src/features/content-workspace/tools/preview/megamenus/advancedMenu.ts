/*
 * Preview Advanced megamenu configuration.
 * - Defines the environment, request data, and preview settings columns.
 * - Keeps item ids centralized for caller-owned state wiring.
 */
import type { MegamenuConfig } from "../../../megamenus/types";

export const ADVANCED_SITE_ID = "advanced-site";
export const ADVANCED_DEVICE_ID = "advanced-device";
export const ADVANCED_OPTIONS_ID = "advanced-options";
export const ADVANCED_QUERY_STRINGS_ID =
  "advanced-query-strings";
export const ADVANCED_FORM_ID = "advanced-form";
export const ADVANCED_COOKIES_ID = "advanced-cookies";
export const ADVANCED_SERVER_VARIABLES_ID =
  "advanced-server-variables";
export const ADVANCED_INCLUDE_BROWSER_COOKIES_ID =
  "advanced-include-browser-cookies";
export const ADVANCED_SHOW_ALL_PAGES_ID =
  "advanced-show-all-pages";

export const previewAdvancedMenu: MegamenuConfig = {
  id: "preview-advanced",
  columns: [
    {
      id: "environment",
      header: "Environment",
      items: [
        {
          type: "select",
          id: ADVANCED_SITE_ID,
          label: "Site",
          options: [
            {
              value: "Default",
              label: "Default",
            },
          ],
        },
        {
          type: "select",
          id: ADVANCED_DEVICE_ID,
          label: "Device",
          options: [
            {
              value: "Desktop",
              label: "Desktop",
            },
            {
              value: "Tablet",
              label: "Tablet",
            },
            {
              value: "Mobile",
              label: "Mobile",
            },
          ],
        },
      ],
    },
    {
      id: "request-data",
      header: "Request URL with",
      items: [
        {
          type: "text-input",
          id: ADVANCED_QUERY_STRINGS_ID,
          label: "Query strings",
        },
        {
          type: "text-input",
          id: ADVANCED_FORM_ID,
          label: "POST data",
        },
        {
          type: "text-input",
          id: ADVANCED_COOKIES_ID,
          label: "Cookies",
        },
        {
          type: "text-input",
          id: ADVANCED_SERVER_VARIABLES_ID,
          label: "Server variables",
        },
        {
          type: "checkbox",
          id: ADVANCED_INCLUDE_BROWSER_COOKIES_ID,
          label: "Include browser cookies",
        },
      ],
    },
    {
      id: "preview-settings",
      header: "Preview settings",
      items: [
        {
          type: "select",
          id: ADVANCED_OPTIONS_ID,
          label: "Options",
          options: [
            {
              value: "Default",
              label: "Default",
            },
          ],
        },
        {
          type: "checkbox",
          id: ADVANCED_SHOW_ALL_PAGES_ID,
          label: "Show all pages",
        },
      ],
    },
  ],
};
