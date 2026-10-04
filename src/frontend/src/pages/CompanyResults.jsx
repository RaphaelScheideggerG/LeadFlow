import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  Title,
  Text,
  Stack,
  ActionIcon,
  Group,
  Notification,
} from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';
import { IconMenu2 } from '@tabler/icons-react';

import CompanyTable from '../components/results/tables/CompanyTable';
import SideMenu from '../components/SideMenu';
import DeleteMenu from '../components/results/DeleteMenu';

import CompanyDetailsMenu from '../components/results/details/CompanyDetailsMenu';

export default function CompanyResults() {
  const [opened, { open, close }] = useDisclosure(false);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openedDeleteMenu, setOpenedDeleteMenu] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const [openedDetailsMenu, setOpenedDetailsMenu] = useState(false)
  const [companiesIDsToViewDetails, setCompaniesIDsToViewDetails] = useState([]);
  const [companiesDetails, setCompaniesDetails] = useState([]);

  const [searchParams] = useSearchParams();

  const carregarCompanies = async (searchIDs = []) => {
    try {
      const params = new URLSearchParams();

      searchIDs.forEach(id => {
        params.append('search_ids', id);
      });

      const url = searchIDs.length > 0
        ? `/api/companies?${params.toString()}`
        : '/api/companies';

      const response = await fetch(url);

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Erro ao buscar empresas.');
        }

        throw new Error(
          `Servidor indisponível (HTTP ${response.status}).`
        );
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

  const handleShowDetails = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        '/api/companies-details',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ids: companiesIDsToViewDetails,
          }),
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Erro ao mostrar detalhes da empresa.');
        }

        throw new Error(
          `Servidor indisponível (HTTP ${response.status}).`
        );
      }

      const detailedCompanies = await response.json();

      setCompaniesDetails(detailedCompanies)
      setOpenedDetailsMenu(true);

    } catch (error) {
      console.error('Erro ao mostrar detalhes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/delete-companies', {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedRows),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Erro ao deletar empresas.');
        }

        throw new Error(
          `Servidor indisponível (HTTP ${response.status}).`
        );
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

  useEffect(() => {
    const searchIDs = searchParams.getAll('search_ids');

    carregarCompanies(searchIDs);
  }, []);

  useEffect(() => {
    if (companiesIDsToViewDetails.length === 0) {
      return;
    }

    handleShowDetails();
  }, [companiesIDsToViewDetails]);


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

      <DeleteMenu
        opened={openedDeleteMenu}
        onClose={() => setOpenedDeleteMenu(false)}
        onConfirm={handleDelete}
        message="Tem certeza que deseja deletar esta empresa? Esta ação é irreversível e os dados serão removidos do banco de dados. Esta ação também exclui o Lead associado a empresa."
      />

      <CompanyDetailsMenu
        opened={openedDetailsMenu}
        onClose={() => setOpenedDetailsMenu(false)}
        companies={companiesDetails}
      />
      
      <CompanyTable
        data={data}
        loading={loading}
        setOpenedDeleteMenu={setOpenedDeleteMenu}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        setCompaniesIDsToViewDetails={setCompaniesIDsToViewDetails}
      />
    </Stack>
  );
}