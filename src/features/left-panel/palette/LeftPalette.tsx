/*
 * Left panel palette.
 * - Displays the expandable view rail for the selected workspace domain.
 * - Notifies the app shell when a workspace view is selected.
 */
import {
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Icon } from "@tabler/icons-react";

import { Box, Stack } from "@mantine/core";

import { PaletteItem } from "./PaletteItem";
import { PALETTE_ITEM_SIZE } from "./PaletteItem";
import type { WorkspaceUtilityKey } from "../../workspace/types";

const paletteBackground = "rgba(255,255,255,0.72)";
const paletteBorder =
  "1px solid var(--mantine-color-asxGray-4)";
const paletteShadow =
  "0 8px 24px rgba(61,68,109,0.16)";

const PALETTE_PADDING_X = 10;
const PALETTE_COLLAPSED_WIDTH =
  PALETTE_ITEM_SIZE + PALETTE_PADDING_X * 2;
const PALETTE_EXPANDED_WIDTH = 228;
const PALETTE_EXPAND_DELAY_MS = 200;
const PALETTE_ANIMATION_MS = 240;
const paletteTransition =
  `width ${PALETTE_ANIMATION_MS}ms cubic-bezier(0.2, 0, 0, 1)`;

type UtilityPaletteItem = {
  id: WorkspaceUtilityKey;
  label: string;
  icon: Icon;
  dividerAfter?: boolean;
};

type LeftPaletteProps = {
  utilityItems: UtilityPaletteItem[];
  selectedUtilityId: WorkspaceUtilityKey;
  onSelectUtility: (
    utilityId: WorkspaceUtilityKey
  ) => void;
};

export const LeftPalette = ({
  utilityItems,
  selectedUtilityId,
  onSelectUtility,
}: LeftPaletteProps) => {
  const [expanded, setExpanded] = useState(false);
  const expandTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (expandTimerRef.current) {
        window.clearTimeout(expandTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (expandTimerRef.current) {
      window.clearTimeout(expandTimerRef.current);
    }

    expandTimerRef.current = window.setTimeout(() => {
      setExpanded(true);
      expandTimerRef.current = null;
    }, PALETTE_EXPAND_DELAY_MS);
  };

  const handleMouseLeave = () => {
    if (expandTimerRef.current) {
      window.clearTimeout(expandTimerRef.current);
      expandTimerRef.current = null;
    }

    setExpanded(false);
  };

  const clearExpandTimer = () => {
    if (expandTimerRef.current) {
      window.clearTimeout(expandTimerRef.current);
      expandTimerRef.current = null;
    }
  };

  const handleSelectUtility = (itemId: string) => {
    clearExpandTimer();
    onSelectUtility(itemId);
    setExpanded(false);
  };

  const utilityItemsProps = {
    expanded,
    selectedItemId: selectedUtilityId,
    onSelectItem: handleSelectUtility,
    items: utilityItems,
  };

  const displayGroupProps = {
    expanded,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  return (
    <DisplayGroup {...displayGroupProps}>
      <PaletteItems {...utilityItemsProps} />
    </DisplayGroup>
  );
};

type DisplayGroupProps = {
  children: ReactNode;
  expanded: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

function DisplayGroup({
  children,
  expanded,
  onMouseEnter,
  onMouseLeave,
}: DisplayGroupProps) {
  return (
    <Box
      mt={10}
      ml={12}
      px={PALETTE_PADDING_X}
      py={12}
      bg={paletteBackground}
      w={
        expanded
          ? PALETTE_EXPANDED_WIDTH
          : PALETTE_COLLAPSED_WIDTH
      }
      style={{
        borderRadius:8,
        backdropFilter: "blur(16px)",
        border: paletteBorder,
        boxShadow: paletteShadow,
        zIndex: 5,
        overflow: "hidden",
        transition: paletteTransition,
        transformOrigin: "left center",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Stack align="stretch" gap={10}>
        {children}
      </Stack>
    </Box>
  );
}

type PaletteItemsProps = {
  expanded: boolean;
  selectedItemId: string;
  onSelectItem: (itemId: string) => void;
  items: UtilityPaletteItem[];
};

function PaletteItems({
  expanded,
  selectedItemId,
  onSelectItem,
  items,
}: PaletteItemsProps) {
  return (
    <>
      {items.map((item) => {
        return (
          <Fragment key={item.id}>
            <PaletteItem
              id={item.id}
              label={item.label}
              icon={item.icon}
              expanded={expanded}
              selectedItemId={selectedItemId}
              onSelectItem={onSelectItem}
            />
            {item.dividerAfter ? <PaletteDivider /> : null}
          </Fragment>
        );
      })}
    </>
  );
}

function PaletteDivider() {
  return (
    <Box py={8} aria-hidden="true">
      <Box h={1} w="100%" bg="asxGray.6" />
    </Box>
  );
}
