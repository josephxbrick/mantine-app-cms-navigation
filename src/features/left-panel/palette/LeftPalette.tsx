/*
 * Left panel palette.
 * - Displays the expandable domain rail for major workspace areas.
 * - Notifies the app shell when a workspace domain is selected.
 */
import {
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Icon } from "@tabler/icons-react";

import { Box, Stack, Text } from "@mantine/core";
import {
  IconLayoutGridAdd,
  IconLayoutSidebar,
  IconPhotoCode,
  IconTargetArrow,
  IconUserShield,
} from "@tabler/icons-react";

import { PaletteItem } from "./PaletteItem";
import { PALETTE_ITEM_SIZE } from "./PaletteItem";
import type {
  WorkspaceDomain,
  WorkspaceUtilityKey,
} from "../../workspace/types";

const paletteBackground = "rgba(255,255,255,0.72)";
const paletteBorder =
  "1px solid var(--mantine-color-asxGray-4)";
const paletteShadow =
  "0 8px 24px rgba(61,68,109,0.16)";

const PALETTE_PADDING_X = 10;
const PALETTE_COLLAPSED_WIDTH =
  PALETTE_ITEM_SIZE + PALETTE_PADDING_X * 2;
const PALETTE_EXPANDED_WIDTH = 228;
const PALETTE_EXPAND_DELAY_MS = 1333;
const PALETTE_ANIMATION_MS = 240;
const paletteTransition =
  `width ${PALETTE_ANIMATION_MS}ms cubic-bezier(0.2, 0, 0, 1)`;

const paletteItems = [
  { id: "site", label: "Site", icon: IconLayoutSidebar },

  {
    id: "assets",
    label: "Assets",
    icon: IconPhotoCode,
  },

  {
    id: "ctp",
    label: "CT&P",
    icon: IconTargetArrow,
  },

  {
    id: "administration",
    label: "Administration",
    icon: IconUserShield,
  },

  { id: "apps", label: "Apps", icon: IconLayoutGridAdd },
];

type UtilityPaletteItem = {
  id: WorkspaceUtilityKey;
  label: string;
  icon: Icon;
};

type LeftPaletteProps = {
  selectedDomain: WorkspaceDomain;
  utilityItems: UtilityPaletteItem[];
  selectedUtilityId: WorkspaceUtilityKey;
  onSelectDomain: (domain: WorkspaceDomain) => void;
  onSelectUtility: (
    utilityId: WorkspaceUtilityKey
  ) => void;
};

export const LeftPalette = ({
  selectedDomain,
  utilityItems,
  selectedUtilityId,
  onSelectDomain,
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

  const handleSelectDomain = (itemId: string) => {
    clearExpandTimer();
    onSelectDomain(itemId as WorkspaceDomain);
    setExpanded(false);
  };

  const handleSelectUtility = (itemId: string) => {
    clearExpandTimer();
    onSelectUtility(itemId);
    setExpanded(false);
  };

  const domainItemsProps = {
    expanded,
    selectedItemId: selectedDomain,
    onSelectItem: handleSelectDomain,
    items: paletteItems,
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
      <PaletteItems {...domainItemsProps} />
      <UtilitiesDivider />
      <UtilitiesLabel expanded={expanded} />
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
        borderRadius: 12,
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
          <PaletteItem
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            expanded={expanded}
            selectedItemId={selectedItemId}
            onSelectItem={onSelectItem}
          />
        );
      })}
    </>
  );
}

function UtilitiesDivider() {
  return (
    <Box
      h={1}
      mx={8}
      bg="asxGray.4"
      style={{ flexShrink: 0 }}
    />
  );
}

type UtilitiesLabelProps = {
  expanded: boolean;
};

function UtilitiesLabel({
  expanded: _expanded,
}: UtilitiesLabelProps) {
  return (
    <Text
      fz={12}
      fw={700}
      w="100%"
      ta="center"
      style={{
        boxSizing: "border-box",
        color: "var(--mantine-color-asxGray-7)",
        minHeight: 12,
        lineHeight: "12px",
        letterSpacing: 0,
        whiteSpace: "nowrap",
      }}
    >
      VIEWS
    </Text>
  );
}
