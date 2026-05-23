/*
 * Palette item button.
 * - Renders one icon/label button in the left palette.
 * - Applies selected/unselected styling and notifies the palette when clicked.
 */
import { Box, Text } from "@mantine/core";
import type { Icon } from "@tabler/icons-react";
import type { ReactNode } from "react";

type PaletteItemProps = {
    id: string;
    label: string;
    icon: Icon;
    expanded: boolean;
    selectedItemId: string;
    onSelectItem: (itemId: string) => void;
};

const selectedIconColor = "asxIndigo.8";
const unselectedIconColor = "asxGray.8";
const selectedIconBackground = "asxIndigo.0";
export const PALETTE_ICON_SIZE = 34;
export const PALETTE_ITEM_SIZE = 50;
const LABEL_ANIMATION_MS = 150;
const LABEL_ENTER_DELAY_MS = 70;

type DisplayGroupProps = {
    children: ReactNode;
    id: string;
    label: string;
    isSelected: boolean;
    onSelectItem: (itemId: string) => void;
};

function DisplayGroup({
    children,
    id,
    label,
    isSelected,
    onSelectItem,
}: DisplayGroupProps) {
    return (
        <Box
            component="button"
            type="button"
            px={9}
            py={7}
            w="100%"
            h={PALETTE_ITEM_SIZE}
            aria-label={label}
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
                justifyContent: "flex-start",
                gap: 10,
                borderRadius: 6,
                border: isSelected
                    ? "1px solid var(--mantine-color-asxIndigo-4)"
                    : "1px solid transparent",
                cursor: "pointer",
                overflow: "hidden",
                transition:
                    "background-color 120ms ease, border-color 120ms ease, color 120ms ease, transform 120ms ease",
            }}
            onClick={() => onSelectItem(id)}
        >
            {children}
        </Box>
    );
}

export const PaletteItem = ({
    id,
    label,
    icon: Icon,
    expanded,
    selectedItemId,
    onSelectItem,
}: PaletteItemProps) => {
    const isSelected = selectedItemId === id;

    return (
        <DisplayGroup
            id={id}
            label={label}
            isSelected={isSelected}
            onSelectItem={onSelectItem}
        >
            <Box
                display="flex"
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                <Icon
                    size={PALETTE_ICON_SIZE}
                    stroke={1.25}
                />
            </Box>

            <Text
                fw={isSelected ? 600 : 500}
                style={{
                    fontSize: 16,
                    whiteSpace: "nowrap",
                    opacity: expanded ? 1 : 0,
                    transform: expanded
                        ? "translateX(0)"
                        : "translateX(-4px)",
                    transition: expanded
                        ? `opacity ${LABEL_ANIMATION_MS}ms ease ${LABEL_ENTER_DELAY_MS}ms, transform ${LABEL_ANIMATION_MS}ms ease ${LABEL_ENTER_DELAY_MS}ms`
                        : `opacity ${LABEL_ANIMATION_MS}ms ease, transform ${LABEL_ANIMATION_MS}ms ease`,
                }}
            >
                {label}
            </Text>
        </DisplayGroup>
    );
};
