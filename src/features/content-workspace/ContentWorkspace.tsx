import { Box, Flex, Text } from "@mantine/core";

import { PrimaryToolbar } from "./toolbars/PrimaryToolbar";
import SecondaryToolbar from "./toolbars/SecondaryToolbar";

type ContentWorkspaceProps = {
  selectedNodeLabel: string;
};

export function ContentWorkspace({
  selectedNodeLabel,
}: ContentWorkspaceProps) {
  return (
    <Flex direction="column" flex={1}>
      <PrimaryToolbar selectedNodeLabel={selectedNodeLabel} />

      <SecondaryToolbar />

      <Box
        bg="gray.1"
        style={{
          flex: 1,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Text
          c="asxGray.6"
          fw={500}
          size="xl"
        >
          {selectedNodeLabel}
        </Text>
      </Box>
    </Flex>
  );
}
