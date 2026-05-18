import {
  Group,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";

import {
  IconCheck,
  IconChecks,
  IconFile,
  IconFiles,
  IconFolderCheck,
  IconHistory,
  IconLogin,
  IconRotate,
} from "@tabler/icons-react";

const columns = [
  {
    title: "Actions",
    items: [
      {
        label: "Check In",
        icon: IconLogin,
      },
      {
        label: "Undo Checkout",
        icon: IconRotate,
      },
      {
        label: "Rollback",
        icon: IconHistory,
      },
    ],
  },
  {
    title: "Mark for Publish",
    items: [
      {
        label: "Mark Page",
        icon: IconCheck,
      },
      {
        label: "Mark Page & Children",
        icon: IconChecks,
      },
    ],
  },
  {
    title: "Publish",
    items: [
      {
        label: "Publish Page",
        icon: IconFile,
      },
      {
        label: "Publish Page & Children",
        icon: IconFiles,
      },
      {
        label: "Publish Site",
        icon: IconFolderCheck,
      },
    ],
  },
];

export default function MegamenuPublish() {
  return (
    <SimpleGrid
      cols={3}
      spacing={48}
      style={{
        width: 3 * 240 + 2 * 48,
      }}
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

                  <Text size="sm" fw={500} c="asxGray.7">
                    {item.label}
                  </Text>
                </Group>
              </UnstyledButton>
            );
          })}
        </Stack>
      ))}
    </SimpleGrid>
  );
}