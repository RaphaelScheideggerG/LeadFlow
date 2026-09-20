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
  IconX,
  IconCheck,
  IconFilter,
  IconSortAscending,
  IconSortDescending,
} from '@tabler/icons-react';

import { useState } from 'react';


export default function CompanyTable({
  data,
  loading,
  setOpenedDeleteMenu,
  selectedRows,
  setSelectedRows
}) {
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('name');

  if (loading) {
    return (
      <Center h="50vh">
        <Loader size="lg" />
      </Center>
    );
  }

  const handleViewDetails = (company) => {
    console.log('Ver detalhes:', company);
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const toggleRow = (id) => {
    setSelectedRows((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const toggleAll = () => {
    setSelectedRows((current) =>
      current.length === data.length
        ? []
        : data.map((item) => item.id)
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

    if (orderBy === 'segment') {
      return a.segmento.localeCompare(b.segmento);
    }

    if (orderBy === 'score') {
      return b.ia_score - a.ia_score;
    }

    if (orderBy === 'rating') {
      return b.avaliacao - a.avaliacao;
    }

    if (orderBy === 'reviews') {
      return b.quantidade_avaliacoes - a.quantidade_avaliacoes;
    }

    return 0;
  });

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
          aria-label="Selecionar empresa"
          checked={selectedRows.includes(row.id)}
          onChange={() => toggleRow(row.id)}
        />
      </Table.Td>

      <Table.Td>{row.nome_empresa}</Table.Td>
      <Table.Td>{row.telefone}</Table.Td>
      <Table.Td>{row.segmento}</Table.Td>
      <Table.Td>{row.ia_score}</Table.Td>
      <Table.Td>
        {row.site ? (
          <IconCheck
            size={18}
            stroke={1.5}
            color="gray"
          />
        ) : (
          <IconX
            size={18}
            stroke={1.5}
            color="gray"
          />
        )}
      </Table.Td>
      <Table.Td>{row.avaliacao}</Table.Td>
      <Table.Td>{row.quantidade_avaliacoes}</Table.Td>
      <Table.Td>{row.endereco}</Table.Td>
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
            leftSection={
              <IconSearch
                size={16}
                stroke={1.5}
              />
            }
            value={search}
            onChange={handleSearchChange}
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
                styles={{
                  root: {
                    '&:focusVisible?': {
                      outline: 'none'
                    }
                  }
                }}
              >
                <IconFilter size={20} stroke={1.5}/>
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Ordenar por</Menu.Label>

              <Menu.Item
                leftSection={
                  <IconSortAscending size={14} />
                }
                onClick={() => setOrderBy('name')}
                rightSection={
                  orderBy === 'name'
                    ? (
                      <IconCheck
                        size={14}
                        color="var(--mantine-color-blue-filled)"
                      />
                    )
                    : null
                }
                fw={orderBy === 'name' ? 600 : 400}
                bg={
                  orderBy === 'name'
                    ? 'var(--mantine-color-blue-light)'
                    : undefined
                }
              >
                Nome (A-Z)
              </Menu.Item>

              <Menu.Item
                leftSection={
                  <IconSortAscending size={14} />
                }
                onClick={() => setOrderBy('segment')}
                rightSection={
                  orderBy === 'segment'
                    ? (
                      <IconCheck
                        size={14}
                        color="var(--mantine-color-blue-filled)"
                      />
                    )
                    : null
                }
                fw={orderBy === 'segment' ? 600 : 400}
                bg={
                  orderBy === 'segment'
                    ? 'var(--mantine-color-blue-light)'
                    : undefined
                }
              >
                Segmento (A-Z)
              </Menu.Item>

              <Menu.Item
                leftSection={
                  <IconSortDescending size={14} />
                }
                onClick={() => setOrderBy('score')}
                rightSection={
                  orderBy === 'score'
                    ? (
                      <IconCheck
                        size={14}
                        color="var(--mantine-color-blue-filled)"
                      />
                    )
                    : null
                }
                fw={orderBy === 'score' ? 600 : 400}
                bg={
                  orderBy === 'score'
                    ? 'var(--mantine-color-blue-light)'
                    : undefined
                }
              >
                Score (maior)
              </Menu.Item>

              <Menu.Item
                leftSection={
                  <IconSortDescending size={14} />
                }
                onClick={() => setOrderBy('rating')}
                rightSection={
                  orderBy === 'rating'
                    ? (
                      <IconCheck
                        size={14}
                        color="var(--mantine-color-blue-filled)"
                      />
                    )
                    : null
                }
                fw={orderBy === 'rating' ? 600 : 400}
                bg={
                  orderBy === 'rating'
                    ? 'var(--mantine-color-blue-light)'
                    : undefined
                }
              >
                Avaliação (maior)
              </Menu.Item>

              <Menu.Item
                leftSection={
                  <IconSortDescending size={14} />
                }
                onClick={() => setOrderBy('reviews')}
                rightSection={
                  orderBy === 'reviews'
                    ? (
                      <IconCheck
                        size={14}
                        color="var(--mantine-color-blue-filled)"
                      />
                    )
                    : null
                }
                fw={orderBy === 'reviews' ? 600 : 400}
                bg={
                  orderBy === 'reviews'
                    ? 'var(--mantine-color-blue-light)'
                    : undefined
                }
              >
                Avaliações (maior)
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
          <Table miw={1300} highlightOnHover stickyHeader>
            <Table.Thead>
              <Table.Tr>
                {selectedRows.length > 0 ? (
                  <Table.Th
                    colSpan={10}
                    style={{
                      backgroundColor:'var(--mantine-color-blue-light)',
                    }}
                  >
                    <Group justify="flex-start" gap="md" px="xs">
                      <Checkbox
                        onChange={toggleAll}
                        checked={selectedRows.length === data.length}
                        indeterminate={
                          selectedRows.length > 0 &&
                          selectedRows.length !== data.length
                        }
                        aria-label="Selecionar todas"
                      />

                      <ActionIcon
                        variant="filled"
                        color="red"
                        size="sm"
                        onClick={() =>
                          setOpenedDeleteMenu(true)
                        }
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
                        aria-label="Selecionar todas"
                      />
                    </Table.Th>

                    <Table.Th>Empresa</Table.Th>
                    <Table.Th>Telefone</Table.Th>
                    <Table.Th>Segmento</Table.Th>
                    <Table.Th>Score</Table.Th>
                    <Table.Th>Website</Table.Th>
                    <Table.Th>Avaliação</Table.Th>
                    <Table.Th>Avaliações</Table.Th>
                    <Table.Th>Endereço</Table.Th>
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
