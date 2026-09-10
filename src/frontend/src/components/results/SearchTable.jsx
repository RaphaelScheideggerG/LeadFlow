import { useState } from 'react';

import {
  ScrollArea,
  Table,
  ActionIcon,
  Group,
  Checkbox,
  Text,
  Loader,
  Center,
} from '@mantine/core';

import { IconTrash } from '@tabler/icons-react';

export default function SearchTable({ data, loading }) {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleViewDetails = (search) => {
    console.log('Ver detalhes:', search);
  };

  const handleDelete = (searches) => {
    console.log('Deletar:', searches);
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

  if (loading) {
    return (
      <Center h="50vh">
        <Loader size="lg" />
      </Center>
    );
  }

  const rows = data.map((row) => (
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

      <Table.Td>{row.id}</Table.Td>
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
                    checked={selectedRows.length === data.length}
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length !== data.length
                    }
                    aria-label="Select all rows"
                  />

                  <ActionIcon
                    variant="filled"
                    color="red"
                    size="sm"
                    onClick={() => handleDelete(selectedRows)}
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

                <Table.Th>Id</Table.Th>
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
  );
}