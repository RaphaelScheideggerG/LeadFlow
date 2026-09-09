import { Title, Text, Stack, ActionIcon, Group, Card } from '@mantine/core';
import SearchTable from '../components/results/SearchTable';
import SideMenu from '../components/SideMenu';

import { useDisclosure } from '@mantine/hooks';
import { IconMenu2 } from '@tabler/icons-react';

export default function CompanyResults() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Stack gap="lg" p="md">
      <SideMenu opened={opened} onClose={close} />

      <Group align="center" gap="sm">
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={open}
          size="lg"
        >
          <IconMenu2 size={24} />
        </ActionIcon>

        <Title order={1} size="h1">
          <Text
            span
            inherit
            fw={900}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
          >
            BUSCAS
          </Text>
        </Title>
      </Group>

      {/* Tabela envelopada no Card arredondado */}
      <Card shadow="sm" padding="lg" radius="lg" withBorder>
        <SearchTable />
      </Card>
    </Stack>
  );
}