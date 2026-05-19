import { Box, Group, Text } from "@mantine/core";
import { IconSitemap } from "@tabler/icons-react";

export const LeftPanelHeader = () => {
    return (
        <Box
            h={72}
            bg="asxIndigo.1"
            style={{
                flexShrink: 0,
                borderBottom: "1px solid var(--mantine-color-asxIndigo-3)",
            }}
        >
            <Group
                h="100%"
                gap={12}
                wrap="nowrap"
                px="lg"
            >
                <IconSitemap
                    size={28}
                    stroke={1.5}
                    color="var(--mantine-color-asxIndigo-9)"
                />

                <Text
                    size="lg"
                    fw={600}
                    c="asxIndigo.9"
                    truncate
                >
                    Site Tree
                </Text>
            </Group>
        </Box>
    );
};
