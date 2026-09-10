import { useEffect, useState } from 'react';
import { Title, Text, Stack, ActionIcon, Group, Card, Notification} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMenu2 } from '@tabler/icons-react';

import SearchTable from '../components/results/SearchTable';
import SideMenu from '../components/SideMenu';

export default function SearchResults() {
  const [opened, { open, close }] = useDisclosure(false);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarBuscas = async () => {
      try {
        const response = await fetch('http://localhost:8000/searches');

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail);
        }

        const dataFromApi = await response.json();
        setData(dataFromApi);

      } catch (error) {
        console.error('Erro ao buscar buscas:', error);
        setError(error.message);

      } finally {
        setLoading(false);
      }
    };

    carregarBuscas();
  }, []);

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

      {error && (
        // popup aqui
        <Notification
            color="red"
            title="Erro"
            onClose={() => setError(null)}
        >
            {error}
        </Notification>
      )}

      <Card shadow="sm" padding="lg" radius="lg" withBorder>
        <SearchTable
          data={data}
          loading={loading}
        />
      </Card>

    </Stack>
  );
}