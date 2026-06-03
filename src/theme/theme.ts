/*
 * File purpose: Builds the Mantine theme object used by the CMS navigation prototype.
 *
 * Imports:
 * - createTheme from "@mantine/core" provides Mantine UI primitives, theme helpers, component types, or styling utilities used in this file.
 * - colors from "./colors" provides custom color scales for the project Mantine theme.
 */
import { createTheme } from "@mantine/core";

import { colors } from "./colors";

export const theme = createTheme({
  colors,

  primaryColor: "asxBlue",
});