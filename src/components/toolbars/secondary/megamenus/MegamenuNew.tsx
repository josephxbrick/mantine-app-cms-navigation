import {
  Group,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";

import {
  IconAtom,
  IconFile,
  IconFolder,
  IconMap,
} from "@tabler/icons-react";

const columns = [
  {
    title: "Content",
    items: [
      {
        label: "Page",
        icon: IconFile,
      },
      {
        label: "Component",
        icon: IconAtom,
      },
    ],
  },
  {
    title: "Other",
    items: [
      {
        label: "Folder",
        icon: IconFolder,
      },
      {
        label: "DITA Alias",
        icon: IconMap,
      },
    ],
  },
];

export default function MegamenuNew() {
  return (
   <SimpleGrid
  cols={2}
  spacing={80}
  style={{ width: 2 * 240 + 1 * 48, }}
>
      {columns.map((column) => (
        <Stack key={column.title} gap={8} w={240}>
          <Text
            size="xs"
            fw={700}
            c="asxGray.6"
            tt="uppercase"
          >
            {column.title}
          </Text>

          <Stack gap={8}>
            {column.items.map((item) => {
              const Icon = item.icon;

              return (
                <UnstyledButton key={item.label}>
                  <Group gap={12} py={6}>
                    <Icon
                      size={28}
                      stroke={1.3}
                      color="var(--mantine-color-asxGray-7)"
                    />

                    <Text size="sm" fw={600} c="asxGray.7">
                      {item.label}
                    </Text>
                  </Group>
                </UnstyledButton>
              );
            })}
          </Stack>
        </Stack>
      ))}
    </SimpleGrid>
  );
}