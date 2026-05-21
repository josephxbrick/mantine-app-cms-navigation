/*
 * Site tree icon set.
 * - Provides consistent chevron, folder, open-folder, and page icons.
 * - Centralizes size/color defaults for tree rows.
 */
import {
  IconArchive,
  IconChevronDown,
  IconChevronRight,
  IconFile,
  IconFileText,
  IconFolder,
  IconFolderOpen,
  IconPhoto,
  IconVideo,
} from "@tabler/icons-react";

import type { SiteTreeNodeIconKey } from "./types";

type SiteTreeIconProps = {
  size?: number;
};

export const ChevronClosedIcon = ({
  size = 20,
}: SiteTreeIconProps) => (
  <IconChevronRight
    size={size}
    stroke={1.3}
    color="var(--mantine-color-asxGray-7)"
  />
);

export const ChevronOpenIcon = ({
  size = 20,
}: SiteTreeIconProps) => (
  <IconChevronDown
    size={size}
    stroke={1.3}
    color="var(--mantine-color-asxGray-7)"
  />
);

export const FolderClosedIcon = ({
  size = 24,
}: SiteTreeIconProps) => (
  <IconFolder
    size={size}
    stroke={1.3}
    color="var(--mantine-color-asxGray-7)"
  />
);

export const FolderOpenIcon = ({
  size = 24,
}: SiteTreeIconProps) => (
  <IconFolderOpen
    size={size}
    stroke={1.3}
    color="var(--mantine-color-asxGray-7)"
  />
);

export const PageIcon = ({
  size = 24,
}: SiteTreeIconProps) => (
  <IconFile
    size={size}
    stroke={1.3}
    color="var(--mantine-color-asxGray-7)"
  />
);

export const ImageIcon = ({
  size = 24,
}: SiteTreeIconProps) => (
  <IconPhoto
    size={size}
    stroke={1.3}
    color="var(--mantine-color-asxGray-7)"
  />
);

export const DocumentIcon = ({
  size = 24,
}: SiteTreeIconProps) => (
  <IconFileText
    size={size}
    stroke={1.3}
    color="var(--mantine-color-asxGray-7)"
  />
);

export const VideoIcon = ({
  size = 24,
}: SiteTreeIconProps) => (
  <IconVideo
    size={size}
    stroke={1.3}
    color="var(--mantine-color-asxGray-7)"
  />
);

export const AssetIcon = ({
  size = 24,
}: SiteTreeIconProps) => (
  <IconArchive
    size={size}
    stroke={1.3}
    color="var(--mantine-color-asxGray-7)"
  />
);

type TreeNodeIconProps = {
  icon?: SiteTreeNodeIconKey;
  isFolder: boolean;
  isOpen: boolean;
};

export function TreeNodeIcon({
  icon,
  isFolder,
  isOpen,
}: TreeNodeIconProps) {
  if (isFolder || icon === "folder") {
    return isOpen ? (
      <FolderOpenIcon />
    ) : (
      <FolderClosedIcon />
    );
  }

  if (icon === "image") {
    return <ImageIcon />;
  }

  if (icon === "document") {
    return <DocumentIcon />;
  }

  if (icon === "video") {
    return <VideoIcon />;
  }

  if (icon === "asset") {
    return <AssetIcon />;
  }

  return <PageIcon />;
}
