import {
  ScrollArea,
  Table,
  ActionIcon,
  Group,
  Checkbox,
  Text,
  Loader,
  Center,
  Card,
  Menu,
  Stack,
  TextInput,
} from '@mantine/core';

import { 
  IconTrash, 
  IconSearch,
  IconCheck, 
  IconChevronUp, 
  IconChevronDown,
  IconSelector, 
  IconFilter,
  IconSortAscending,
  IconSortDescending,
} from '@tabler/icons-react';

import { useState } from 'react';


export default function SearchTable({data, loading, setOpenedDeleteMenu, selectedRows, setSelectedRows}) {
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('municipio');  
  
    if (loading) {
      return (
        <Center h="50vh">
          <Loader size="lg" />
        </Center>
      );
    }
  
  const handleViewDetails = (search) => {
    console.log('Ver detalhes:', search);
  };

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
    if (orderBy === 'municipio') {
      return a.municipio.localeCompare(b.municipio);
    }

    if (orderBy === 'setor') {
      return a.setor.localeCompare(b.setor);
    }

    if (orderBy === 'correspondencias') {
      return b.total_correspondencias - a.total_correspondencias;
    }

    if (orderBy === 'empresas') {
      return b.total_empresas - a.total_empresas;
    }

    if (orderBy === 'leads') {
      return b.total_leads - a.total_leads;
    }

    if (orderBy === 'data') {
      return new Date(b.timestamp) - new Date(a.timestamp);
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
          aria-label="Select row"
          checked={selectedRows.includes(row.id)}
          onChange={() => toggleRow(row.id)}
        />
      </Table.Td>

      <Table.Td>{row.municipio}</Table.Td>
      <Table.Td>{row.setor}</Table.Td>
      <Table.Td>{row.total_correspondencias}</Table.Td>
      <Table.Td>{row.total_empresas}</Table.Td>
      <Table.Td>{row.total_leads}</Table.Td>

      <Table.Td>
        {new Date(row.timestamp).toLocaleString('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'short',
        })}
      </Table.Td>
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
        <Group justify="space-between" gap="md" px="xs" mb="md">
          <TextInput
            placeholder="Pesquisar em qualquer campo"
            flex={1}
            mb="md"
            leftSection={<IconSearch size={16} stroke={1.5} />}
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />

          <Menu
            shadow="md"
            width={220}
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
                onClick={() => setOrderBy('municipio')}
                rightSection={
                  orderBy === 'municipio'
                    ? <IconCheck size={14} color="var(--mantine-color-blue-filled)" />
                    : null
                }
                fw={orderBy === 'municipio' ? 600 : 400}
                bg={
                  orderBy === 'municipio'
                    ? 'var(--mantine-color-blue-light)'
                    : undefined
                }
              >
                Município (A-Z)
              </Menu.Item>

              <Menu.Item
                leftSection={<IconSortAscending size={14} />}
                onClick={() => setOrderBy('setor')}
                rightSection={
                  orderBy === 'setor'
                    ? <IconCheck size={14} color="var(--mantine-color-blue-filled)" />
                    : null
                }
                fw={orderBy === 'setor' ? 600 : 400}
                bg={
                  orderBy === 'setor'
                    ? 'var(--mantine-color-blue-light)'
                    : undefined
                }
              >
                Setor (A-Z)
              </Menu.Item>

              <Menu.Item
                leftSection={<IconSortDescending size={14} />}
                onClick={() => setOrderBy('correspondencias')}
                rightSection={
                  orderBy === 'correspondencias'
                    ? <IconCheck size={14} color="var(--mantine-color-blue-filled)" />
                    : null
                }
                fw={orderBy === 'correspondencias' ? 600 : 400}
                bg={
                  orderBy === 'correspondencias'
                    ? 'var(--mantine-color-blue-light)'
                    : undefined
                }
              >
                Correspondências (maior)
              </Menu.Item>

              <Menu.Item
                leftSection={<IconSortDescending size={14} />}
                onClick={() => setOrderBy('empresas')}
                rightSection={
                  orderBy === 'empresas'
                    ? <IconCheck size={14} color="var(--mantine-color-blue-filled)" />
                    : null
                }
                fw={orderBy === 'empresas' ? 600 : 400}
                bg={
                  orderBy === 'empresas'
                    ? 'var(--mantine-color-blue-light)'
                    : undefined
                }
              >
                Empresas (maior)
              </Menu.Item>

              <Menu.Item
                leftSection={<IconSortDescending size={14} />}
                onClick={() => setOrderBy('leads')}
                rightSection={
                  orderBy === 'leads'
                    ? <IconCheck size={14} color="var(--mantine-color-blue-filled)" />
                    : null
                }
                fw={orderBy === 'leads' ? 600 : 400}
                bg={
                  orderBy === 'leads'
                    ? 'var(--mantine-color-blue-light)'
                    : undefined
                }
              >
                Leads (maior)
              </Menu.Item>

              <Menu.Item
                leftSection={<IconSortDescending size={14} />}
                onClick={() => setOrderBy('data')}
                rightSection={
                  orderBy === 'data'
                    ? <IconCheck size={14} color="var(--mantine-color-blue-filled)" />
                    : null
                }
                fw={orderBy === 'data' ? 600 : 400}
                bg={
                  orderBy === 'data'
                    ? 'var(--mantine-color-blue-light)'
                    : undefined
                }
              >
                Data (mais recente)
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item
                color="red"
                disabled={!orderBy}
                onClick={() => setOrderBy('')}
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
          <Table miw={1100} highlightOnHover stickyHeader>
            <Table.Thead>
              <Table.Tr>
                {selectedRows.length > 0 ? (
                  <Table.Th
                    colSpan={8}
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
                        checked={selectedRows.length === data.length}
                        indeterminate={
                          selectedRows.length > 0 &&
                          selectedRows.length !== data.length
                        }
                        aria-label="Select all rows"
                      />
                    </Table.Th>

                    <Table.Th>Município</Table.Th>
                    <Table.Th>Setor</Table.Th>
                    <Table.Th>Correspondências</Table.Th>
                    <Table.Th>Empresas</Table.Th>
                    <Table.Th>Leads</Table.Th>
                    <Table.Th>Data</Table.Th>
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