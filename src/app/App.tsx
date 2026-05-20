/*
 * Root application component.
 * - Applies the Mantine theme to the CMS mockup.
 * - Renders the app shell that owns the visible workspace layout.
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
