import { useEffect, useState } from 'react';

import {
  Title,
  Text,
  Stack,
  ActionIcon,
  Group,
  Card,
  Notification,
} from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';
import { IconMenu2 } from '@tabler/icons-react';

import CompanyTable from '../components/results/CompanyTable';
import SideMenu from '../components/SideMenu';

export default function CompanyResults() {
  const [opened, { open, close }] = useDisclosure(false);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarCompanies = async () => {
      try {
        const response = await fetch('http://localhost:8000/companies');

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail);
        }

        const dataFromApi = await response.json();
        setData(dataFromApi);
      } catch (error) {
        console.error('Erro ao buscar empresas:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    carregarCompanies();
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
            EMPRESAS
          </Text>
        </Title>
      </Group>

      {error && (
        <Notification
          color="red"
          title="Erro"
          onClose={() => setError(null)}
        >
          {error}
        </Notification>
      )}

      <Card
        shadow="sm"
        padding="lg"
        radius="lg"
        withBorder
      >
        <CompanyTable
          data={data}
          loading={loading}
        />
      </Card>
    </Stack>
  );
}