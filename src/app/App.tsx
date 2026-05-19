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
