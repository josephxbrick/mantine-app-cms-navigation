import { useState } from "react";

import { Box, Flex } from "@mantine/core";

import { ContentWorkspace } from "../content-workspace/ContentWorkspace";
import { LeftPanel } from "../left-panel/LeftPanel";
import { ProductToolbar } from "../content-workspace/toolbars/ProductToolbar";

export function AppShell() {
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
        <LeftPanel width={leftPaneWidth} />

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

        <ContentWorkspace />
      </Flex>
    </Box>
  );
}
