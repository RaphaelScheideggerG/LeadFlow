import { useEffect, useState } from 'react';
import { 
  Title, 
  Text, 
  Stack, 
  ActionIcon, 
  Group, 
  Notification,
} from '@mantine/core';
import { useNavigate } from "react-router-dom";

import { useDisclosure } from '@mantine/hooks';
import { IconMenu2 } from '@tabler/icons-react';

import SearchTable from '../components/results/tables/SearchTable';
import SideMenu from '../components/SideMenu';
import DeleteMenu from '../components/results/DeleteMenu';

import SearchDetailsMenu from '../components/results/details/SearchDetailsMenu'

export default function SearchResults() {
  const [opened, { open, close }] = useDisclosure(false);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [openedDeleteMenu, setOpenedDeleteMenu] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const [openedDetailsMenu, setOpenedDetailsMenu] = useState(false)
  const [searchesIDsToViewDetails, setSearchesIDsToViewDetails] = useState([]);
  const [searchesDetails, setSearchesDetails] = useState([]);

  const navigate = useNavigate();

  const handleViewCompanies = (searchIDs) => {
      const params = new URLSearchParams();

      if (Array.isArray(searchIDs)) {
          searchIDs.forEach(id => {
              params.append('search_ids', id);
          });
      } else if (searchIDs != null) {
          params.append('search_ids', searchIDs);
      }

      navigate({
          pathname: '/resultados/empresas',
          search: `?${params.toString()}`
      });
  };

  const handleViewLeads = (searchIDs) => {
      const params = new URLSearchParams();

      if (Array.isArray(searchIDs)) {
          searchIDs.forEach(id => {
              params.append('search_ids', id);
          });
      } else if (searchIDs != null) {
          params.append('search_ids', searchIDs);
      }

      navigate({
          pathname: '/resultados/leads',
          search: `?${params.toString()}`
      });
  };


  const carregarBuscas = async () => {
    try {
      const response = await fetch('/api/searches');

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Erro ao listar buscas.');
        }

        throw new Error(
          `Servidor indisponível (HTTP ${response.status}).`
        );
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
  
  const handleShowDetails = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(
        '/api/searches-details',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ids: searchesIDsToViewDetails,
          }),
        }
      );
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Erro ao mostrar detalhes da busca.');
        }

        throw new Error(
          `Servidor indisponível (HTTP ${response.status}).`
        );
      }
      
      const detailedSearches = await response.json();
      
      setSearchesDetails(detailedSearches)
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
      const response = await fetch('/api/delete-searches', {
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
          throw new Error(errorData.detail || 'Erro ao deletar buscas.');
        }

        throw new Error(
          `Servidor indisponível (HTTP ${response.status}).`
        );
      }
      
      await carregarBuscas();
      setSelectedRows([]); 
      
    } catch (error) {
      console.error('Erro ao deletar buscas:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setOpenedDeleteMenu(false);
    }
  };

  useEffect(() => {
      carregarBuscas();
    }, []);
  
  useEffect(() => {
    if (searchesIDsToViewDetails.length === 0) {
      return;
    }
    
    handleShowDetails()
  }, [searchesIDsToViewDetails]);
  
  return (
    <Stack gap="lg" p="md">
      <SideMenu opened={opened} onClose={close} />

      <Group align="center" gap="sm">
        <ActionIcon variant="subtle" color="gray" onClick={open} size="lg">
          <IconMenu2 size={24} />
        </ActionIcon>
        <Title order={1} size="h1">
          <Text span inherit fw={900} variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }}>
            BUSCAS
          </Text>
        </Title>
      </Group>

      {error && (
        <Notification color="red" title="Erro" onClose={() => setError(null)}>
            {error}
        </Notification>
      )}

      <DeleteMenu
        opened={openedDeleteMenu}
        onClose={() => setOpenedDeleteMenu(false)}
        onConfirm={handleDelete}
        message="Tem certeza que deseja deletar esta busca? Esta ação é irreversível. As empresas e Leads associados a esta busca também serão excluídos."
      />

      <SearchDetailsMenu
        opened={openedDetailsMenu}
        onClose={() => setOpenedDetailsMenu(false)}
        searches={searchesDetails}
        onConfirmViewCompanies={handleViewCompanies}
        onConfirmViewLeads={handleViewLeads}
      />

      <SearchTable
        data={data}
        loading={loading}
        setOpenedDeleteMenu={setOpenedDeleteMenu}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        setSearchesIDsToViewDetails={setSearchesIDsToViewDetails}
      />
    </Stack>
  );
}