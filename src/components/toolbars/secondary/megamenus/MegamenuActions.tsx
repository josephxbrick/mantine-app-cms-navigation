import {
  Group,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";

import {
  IconCalendar,
  IconDeviceFloppy,
  IconPencilCheck,
  IconRoute,
  IconTrash,
  IconUser,
  IconUsers,
  IconUserCircle,
} from "@tabler/icons-react";

const columns = [
  {
    title: "Page",
    items: [
      {
        label: "Save",
        icon: IconDeviceFloppy,
        onClick: () => console.log("Save"),
      },
      {
        label: "Rename...",
        icon: IconPencilCheck,
        onClick: () => console.log("Rename"),
      },
      {
        label: "Delete",
        icon: IconTrash,
        onClick: () => console.log("Delete"),
      },
    ],
  },
  {
    title: "Assign To",
    items: [
      {
        label: "Me",
        icon: IconUserCircle,
        onClick: () => console.log("Assign to Me"),
      },
      {
        label: "User...",
        icon: IconUser,
        onClick: () => console.log("Assign to User"),
      },
      {
        label: "Group...",
        icon: IconUsers,
        onClick: () => console.log("Assign to Group"),
      },
    ],
  },
  {
    title: "Workflow",
    items: [
      {
        label: "Advance",
        icon: IconRoute,
        onClick: () => console.log("Advance"),
      },
      {
        label: "Remove from Workflow",
        icon: IconTrash,
        onClick: () => console.log("Remove from Workflow"),
      },
      {
        label: "Show Workflow History",
        icon: IconCalendar,
        onClick: () => console.log("Show Workflow History"),
      },
    ],
  },
];

export default function MegamenuActions() {
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
              <UnstyledButton
                key={item.label}
                onClick={item.onClick}
              >
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