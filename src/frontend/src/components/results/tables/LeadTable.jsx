import {
  ScrollArea,
  Table,
  ActionIcon,
  Group,
  Card,
  Checkbox,
  Text,
  TextInput,
  Loader,
  Center,
  Stack,
  Menu,
} from '@mantine/core';

import { 
  IconTrash, 
  IconSearch,
  IconCheck, 
  IconFilter,
  IconSortAscending,
  IconSortDescending,
} from '@tabler/icons-react';

import { useState } from 'react';


export default function LeadTable({ 
  data, 
  loading, 
  setOpenedDeleteMenu, 
  selectedRows, 
  setSelectedRows,
  setLeadsIDsToViewCompaniesDetails,
}) {
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('name')
  
  if (loading) {
    return (
      <Center h="50vh">
        <Loader size="lg" />
      </Center>
    );
  }

  const handleViewDetails = (lead) => {
    setLeadsIDsToViewCompaniesDetails([lead.id]);
  };
  
  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
  }
  
  const toggleRow = (id) => {
    setSelectedRows((current) =>
      current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id]
  );
};


  const toggleAll = () => {
      const visibleIds = filteredData.map((item) => item.id);
      
      const allVisibleSelected = visibleIds.every((id) =>
        selectedRows.includes(id)
    );
    
    setSelectedRows((current) =>
      allVisibleSelected
    ? current.filter((id) => !visibleIds.includes(id))
    : [...new Set([...current, ...visibleIds])]
    );
  };

  const filteredData = data.filter((row) => {
    const query = search.toLowerCase().trim();
    
    if (!query) {
      return true;
    }
    
    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(query)
    );
  });

  const orderedData = [...filteredData].sort((a, b) => {
    if (orderBy === 'name') {
      return a.nome_empresa.localeCompare(b.nome_empresa);
    }
    
    if (orderBy === 'score') {
      return b.ia_score - a.ia_score;
    }
    
    return 0;
  });

  const visibleIds = filteredData.map((item) => item.id);

  const allVisibleSelected =
    visibleIds.length > 0 &&
    visibleIds.every((id) => selectedRows.includes(id));

  const someVisibleSelected =
    visibleIds.some((id) => selectedRows.includes(id));

  const rows = orderedData.map((row) => (
    <Table.Tr
        key={row.id}
        bg={
          selectedRows.includes(row.id)
          ? 'var(--mantine-color-blue-light)'
          : undefined
        }
        style={{ cursor: 'pointer' }}
        onClick={() => handleViewDetails(row)}
      >
        <Table.Td onClick={(e) => e.stopPropagation()}>
          <Checkbox
            aria-label="Selecionar lead"
            checked={selectedRows.includes(row.id)}
            onChange={() => toggleRow(row.id)}
          />
        </Table.Td>

        <Table.Td>{row.nome_empresa}</Table.Td>
        <Table.Td>{row.ia_score}</Table.Td>
        <Table.Td>{row.ia_justificativa}</Table.Td>
      </Table.Tr>
    ));
  
  return (
    <Stack>
      <Card
        shadow="sm"
        padding="lg"
        radius="lg"
        withBorder
      >
        <Group justify="space-between" gap="md" px="xs">
          <TextInput
            placeholder="Pesquisar em qualquer campo"
            flex={1}
            mb="md"
            leftSection={<IconSearch size={16} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
          />

          <Menu 
            shadow="md"
            width={200}
            position="bottom-end" 
            transitionProps={{ transition: 'pop' }}
          >            
            <Menu.Target>
              <ActionIcon 
                variant={orderBy ? "light" : "subtle"} 
                color={orderBy ? "blue" : "gray"} 
                size="lg"
                title="Opções de ordenação"
                styles={{ root: { '&:focusVisible?': { outline: 'none' } } }}
              >
                <IconFilter size={20} stroke={1.5} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Ordenar por</Menu.Label>
              
              <Menu.Item 
                leftSection={<IconSortAscending size={14} />} 
                onClick={() => setOrderBy('name')}
                rightSection={orderBy === 'name' ? <IconCheck size={14} color="var(--mantine-color-blue-filled)" /> : null}
                fw={orderBy === 'name' ? 600 : 400}
                bg={orderBy === 'name' ? 'var(--mantine-color-blue-light)' : undefined}
              >
                Nome (A-Z)
              </Menu.Item>
              
              <Menu.Item 
                leftSection={<IconSortDescending size={14} />} 
                onClick={() => setOrderBy('score')}
                rightSection={orderBy === 'score' ? <IconCheck size={14} color="var(--mantine-color-blue-filled)" /> : null}
                fw={orderBy === 'score' ? 600 : 400}
                bg={orderBy === 'score' ? 'var(--mantine-color-blue-light)' : undefined}
              >
                Score
              </Menu.Item>
              
              <Menu.Divider />
              
              <Menu.Item 
                color="red" 
                disabled={!orderBy} // Desabilita o botão se nenhuma ordenação estiver ativa
                onClick={() => setOrderBy('')} // Limpa o estado voltando para vazio
              >
                Limpar ordenação
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        <ScrollArea
          w="100%"
          h="75vh"
          offsetScrollbars
        >
          <Table miw={900} highlightOnHover stickyHeader>
            <Table.Thead>
              <Table.Tr>
                {selectedRows.length > 0 ? (
                  <Table.Th
                    colSpan={4}
                    style={{
                      backgroundColor: 'var(--mantine-color-blue-light)',
                    }}
                  >
                    <Group justify="flex-start" gap="md" px="xs">
                      <Checkbox
                        onChange={toggleAll}
                        checked={allVisibleSelected}
                        indeterminate={someVisibleSelected && !allVisibleSelected}
                        aria-label="Selecionar todos"
                      />

                      <ActionIcon
                        variant="filled"
                        color="red"
                        size="sm"
                        onClick={() => setOpenedDeleteMenu(true)}
                        title="Excluir selecionados"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>

                      <Text size="sm" fw={600}>
                        {selectedRows.length} selecionado(s)
                      </Text>
                    </Group>
                  </Table.Th>
                ) : (
                  <>
                    <Table.Th style={{ width: 40 }}>
                      <Checkbox
                        onChange={toggleAll}
                        checked={
                          data.length > 0 &&
                          selectedRows.length === data.length
                        }
                        indeterminate={
                          selectedRows.length > 0 &&
                          selectedRows.length !== data.length
                        }
                        aria-label="Selecionar todos"
                      />
                    </Table.Th>

                    <Table.Th>Empresa</Table.Th>
                    <Table.Th>Score</Table.Th>
                    <Table.Th>Justificativa</Table.Th>
                  </>
                )}
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {rows}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>
    </Stack>
  );
}