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

export default function CompanyTable({ data, loading }) {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleViewDetails = (company) => {
    console.log('Ver detalhes:', company);
  };

  const handleDelete = (companies) => {
    console.log('Deletar selecionadas:', companies);
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
          aria-label="Selecionar empresa"
          checked={selectedRows.includes(row.id)}
          onChange={() => toggleRow(row.id)}
        />
      </Table.Td>

      <Table.Td>{row.nome_empresa}</Table.Td>
      <Table.Td>{row.telefone}</Table.Td>
      <Table.Td>{row.segmento}</Table.Td>
      <Table.Td>{row.ia_score}</Table.Td>
      <Table.Td>{row.ia_justificativa}</Table.Td>
      <Table.Td>{row.site}</Table.Td>
      <Table.Td>{row.avaliacao}</Table.Td>
      <Table.Td>{row.quantidade_avaliacoes}</Table.Td>
      <Table.Td>{row.endereco}</Table.Td>
    </Table.Tr>
  ));

  return (
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
                    aria-label="Selecionar todas"
                  />

                  <ActionIcon
                    variant="filled"
                    color="red"
                    size="sm"
                    onClick={() => handleDelete(selectedRows)}
                    title="Excluir selecionados"
                  >
                    <IconTrash size={32} />
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
                <Table.Th>Justificativa</Table.Th>
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
  );
}