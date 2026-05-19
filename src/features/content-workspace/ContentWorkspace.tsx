import { Box, Flex } from "@mantine/core";

import { PrimaryToolbar } from "./toolbars/PrimaryToolbar";
import SecondaryToolbar from "./toolbars/SecondaryToolbar";

export function ContentWorkspace() {
  return (
    <Flex direction="column" flex={1}>
      <PrimaryToolbar />

      <SecondaryToolbar />

      <Box
        bg="gray.1"
        style={{
          flex: 1,
        }}
      >
        {/* Current content tool workspace */}
      </Box>
    </Flex>
  );
}
