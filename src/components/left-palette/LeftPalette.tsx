import { useState } from "react";

import { Box, Divider, Stack } from "@mantine/core";
import {
  IconBinaryTree2,
  IconCircleDot,
  IconCpu,
  IconLayoutGridAdd,
  IconLayoutSidebarLeftCollapse,
  IconPhotoCode,
  IconSearch,
  IconSitemap,
  IconTags,
  IconTargetArrow,
  IconUserCheck,
  IconUserShield,
  IconWand,
} from "@tabler/icons-react";

import { PaletteItem } from "./PaletteItem";

const paletteBackground = "rgba(255,255,255,0.72)";
const paletteBorder =
  "1px solid var(--mantine-color-asxGray-4)";
const paletteShadow =
  "0 8px 32px rgba(0,0,0,0.08)";

const unselectedIconColor = "asxGray.6";

const paletteItems = [
  { id: "site", icon: IconSitemap },

  { id: "media", icon: IconPhotoCode },

  { id: "campaigns", icon: IconTargetArrow },

  { id: "users", icon: IconUserShield },

  { id: "apps", icon: IconLayoutGridAdd },

  { id: "divider-1", divider: true },

  { id: "ai", icon: IconCpu },

  { id: "records", icon: IconCircleDot },

  { id: "taxonomy", icon: IconTags },

  { id: "workflow", icon: IconUserCheck },

  { id: "assets", icon: IconBinaryTree2 },

  { id: "search", icon: IconSearch },

  { id: "tools", icon: IconWand },
];

export const LeftPalette = () => {
  const [selectedItemId, setSelectedItemId] =
    useState("site");

  return (
    <Box
      pos="absolute"
      top={50}
      left={16}
      px={8}
      py={12}
      bg={paletteBackground}
      style={{
        borderRadius: 12,
        backdropFilter: "blur(16px)",
        border: paletteBorder,
        boxShadow: paletteShadow,
        zIndex: 5,
      }}
    >
      <Stack align="center" gap={10}>
        {paletteItems.map((item) => {
          if ("divider" in item) {
            return (
              <Divider
                key={item.id}
                w={24}
                color="asxGray.6"
                my={4}
              />
            );
          }

          return (
            <PaletteItem
              key={item.id}
              id={item.id}
              icon={item.icon}
              selectedItemId={selectedItemId}
              onSelectItem={setSelectedItemId}
            />
          );
        })}

        <Box
          component="button"
          type="button"
          w={40}
          h={40}
          c={unselectedIconColor}
          bg="transparent"
          display="flex"
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            border: 0,
            cursor: "pointer",
          }}
        >
          <IconLayoutSidebarLeftCollapse
            size={22}
            stroke={1.7}
          />
        </Box>
      </Stack>
    </Box>
  );
};