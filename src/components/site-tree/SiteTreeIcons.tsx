import {
  IconChevronDown,
  IconChevronRight,
  IconFile,
  IconFolder,
  IconFolderOpen,
} from "@tabler/icons-react";

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