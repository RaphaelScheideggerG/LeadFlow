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
import { DeleteMenu } from '../components/results/DeleteMenu';


export default function CompanyResults() {
  const [opened, { open, close }] = useDisclosure(false);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openedDeleteMenu, setOpenedDeleteMenu] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

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

  useEffect(() => {
    carregarCompanies();
  }, []);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/delete-companies', {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedRows),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }

      await carregarCompanies();
      setSelectedRows([]);

    } catch (error) {
      console.error('Erro ao deletar empresas:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setOpenedDeleteMenu(false);
    }
  };

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
        <DeleteMenu
          opened={openedDeleteMenu}
          onClose={() => setOpenedDeleteMenu(false)}
          onConfirm={handleDelete}
        />

        <CompanyTable
          data={data}
          loading={loading}
          setOpenedDeleteMenu={setOpenedDeleteMenu}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      </Card>
    </Stack>
  );
}