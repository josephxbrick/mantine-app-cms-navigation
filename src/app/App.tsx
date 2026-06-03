/*
 * File purpose: Root application component that applies project theming and renders the CMS app shell.
 *
 * Imports:
 * - MantineProvider from "@mantine/core" provides Mantine UI primitives, theme helpers, component types, or styling utilities used in this file.
 * - AppShell from "../features/app-shell/AppShell" provides the main CMS shell component rendered by the app root.
 * - theme from "../theme/theme" provides the project Mantine theme applied at the app root.
 */
import { MantineProvider } from "@mantine/core";

import { AppShell } from "../features/app-shell/AppShell";
import { theme } from "../theme/theme";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <AppShell />
    </MantineProvider>
  );
}
