import { Box } from "@mantine/core";
import type { Icon } from "@tabler/icons-react";

type PaletteItemProps = {
    id: string;
    icon: Icon;
    selectedItemId: string;
    onSelectItem: (itemId: string) => void;
};

const selectedIconColor = "asxIndigo.8";
const unselectedIconColor = "asxGray.8";
const selectedIconBackground = "asxIndigo.0";

export const PaletteItem = ({
    id,
    icon: Icon,
    selectedItemId,
    onSelectItem,
}: PaletteItemProps) => {
    const isSelected = selectedItemId === id;

    return (
        <Box
            component="button"
            type="button"
            p={9}
            c={
                isSelected
                    ? selectedIconColor
                    : unselectedIconColor
            }
            bg={
                isSelected
                    ? selectedIconBackground
                    : "transparent"
            }
            display="flex"
            style={{
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                border: isSelected
                    ? "1px solid var(--mantine-color-asxIndigo-2)"
                    : "1px solid transparent",
                cursor: "pointer",
                transition: "all 120ms ease",
            }}
            onClick={() => onSelectItem(id)}
        >
            <Icon size={26} stroke={1.3} />
        </Box>
    );
};