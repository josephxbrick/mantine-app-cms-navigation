import { useState } from "react";

import { Box, Flex, MantineProvider } from "@mantine/core";

import { LeftPalette } from "./components/left-palette/LeftPalette";
import { LeftPaneHeader } from "./components/left-pane-header/LeftPaneHeader";
import { SiteTree } from "./components/site-tree/SiteTree";
import { ProductToolbar } from "./components/toolbars/product/ProductToolbar";
import { PrimaryToolbar } from "./components/toolbars/primary/PrimaryToolbar";
import SecondaryToolbar from "./components/toolbars/secondary/SecondaryToolbar";
import { theme } from "./themes/theme";

export default function App() {
  const [productToolbarMode, setProductToolbarMode] =
    useState<"default" | "search">("default");

  const [leftPaneWidth, setLeftPaneWidth] = useState(328);

  const startResize = (event: React.MouseEvent<HTMLDivElement>) => {
    const startX = event.clientX;
    const startWidth = leftPaneWidth;

    const resize = (moveEvent: MouseEvent) => {
      const nextWidth = startWidth + moveEvent.clientX - startX;
      setLeftPaneWidth(Math.min(Math.max(nextWidth, 260), 100000));
    };

    const stopResize = () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResize);
    };

    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);
  };

  return (
    <MantineProvider theme={theme}>
      <Box
        h="100vh"
        bg="gray.0"
        style={{
          overflow: "hidden",
          userSelect: "none",
        }}
      >
        <ProductToolbar
          mode={productToolbarMode}
          onGoTo={() => setProductToolbarMode("search")}
          onCloseSearch={() => setProductToolbarMode("default")}
        />

        <Flex h="calc(100vh - 64px)">
          <Box
            w={leftPaneWidth}
            bg="white"
            pos="relative"
            style={{
              borderRight: "1px solid var(--mantine-color-gray-3)",
            }}
          >
            <LeftPaneHeader />

            <Box
              h="calc(100% - 40px)"
              pl={88}
              style={{
                overflow: "hidden",
              }}
            >
              <SiteTree />
            </Box>

            <LeftPalette />
          </Box>

          <Box
            w={10}
            ml={-5}
            mr={-5}
            style={{
              cursor: "ew-resize",
              zIndex: 10,
            }}
            onMouseDown={startResize}
          />

          <Flex direction="column" flex={1}>
            <PrimaryToolbar />

            <SecondaryToolbar />

            <Box
              bg="gray.1"
              style={{
                flex: 1,
              }}
            >
              {/* ContentArea */}
            </Box>
          </Flex>
        </Flex>
      </Box>
    </MantineProvider>
  );
}