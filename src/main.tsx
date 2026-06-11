/*
 * File purpose: Browser entry point that mounts the React CMS navigation prototype into the root DOM node.
 *
 * Imports:
 * - ReactDOM from "react-dom/client" mounts the React application into the browser DOM.
 * - App from "./app/App" provides project-local values used by this file.
 * - MantineProvider from "@mantine/core" provides Mantine UI primitives, theme helpers, component types, or styling utilities used in this file.
 * - "@mantine/core/styles.css" from "@mantine/core/styles.css" loads Mantine's base component styles.
 */
import ReactDOM from "react-dom/client";
import App from "./app/App";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./cursor.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MantineProvider>
    <App />
  </MantineProvider>
);
