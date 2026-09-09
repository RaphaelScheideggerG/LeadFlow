import { useState } from 'react';
import { ScrollArea, Table, ActionIcon, Group, Checkbox, Avatar, Text} from '@mantine/core';

import { IconEye, IconTrash } from '@tabler/icons-react';


const mockData= [
  {
    id: 1,
    municipio: 'Brasília',
    setor: 'TI',
    total_correspondencias: 20,
    total_empresas: 20,
    total_leads: 10,
    timestamp: '2026-09-07 08:54:17',
  },
  {
    id: 2,
    municipio: 'Brasília',
    setor: 'Automação Industrial',
    total_correspondencias: 35,
    total_empresas: 31,
    total_leads: 14,
    timestamp: '2026-09-07 10:21:43',
  },
  {
    id: 3,
    municipio: 'Goiânia',
    setor: 'Tecnologia',
    total_correspondencias: 28,
    total_empresas: 25,
    total_leads: 9,
    timestamp: '2026-09-08 09:15:22',
  },
  {
    id: 4,
    municipio: 'São Paulo',
    setor: 'Software',
    total_correspondencias: 50,
    total_empresas: 47,
    total_leads: 22,
    timestamp: '2026-09-08 14:37:51',
  },
  {
    id: 5,
    municipio: 'Belo Horizonte',
    setor: 'Serviços de TI',
    total_correspondencias: 18,
    total_empresas: 17,
    total_leads: 6,
    timestamp: '2026-09-09 08:02:11',
  },
  {
    id: 6,
    municipio: 'Brasília',
    setor: 'Indústria',
    total_correspondencias: 42,
    total_empresas: 39,
    total_leads: 16,
    timestamp: '2026-09-09 09:48:36',
  },
];


export default function SearchTable({ data = mockData }) {
  const [scrolled, setScrolled] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleViewDetails = (search) => {
    console.log('Ver detalhes:', search);
  };

  const handleDelete = (search) => {
    console.log('Deletar:', search);
  };
  
  const toggleRow = (id) =>
  setSelectedRows((current) =>
    current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
  );

  const toggleAll = () =>
    setSelectedRows((current) => (current.length === data.length ? [] : data.map((item) => item.id)));


  const rows = data.map((row) => (
    <Table.Tr 
      key={row.id}
      bg={selectedRows.includes(row.id) ? 'var(--mantine-color-blue-light)' : undefined}
      style={{ cursor: 'pointer' }}
      onClick={() => handleViewDetails(row)}
    >
      {/* Coluna do Checkbox */}
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
      
      {/* Data formatada nativa do JS */}
      <Table.Td>
        {new Date(row.timestamp).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea
      w="100%"
      h="75vh"
      offsetScrollbars
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <Table miw={1100} highlightOnHover stickyHeader>
        <Table.Thead>
          <Table.Tr>
            {selectedRows.length > 0 ? (
              // Barra de ações em lote no topo quando houver seleção
              <Table.Th colSpan={8} style={{ backgroundColor: 'var(--mantine-color-blue-light)' }}>
                <Group justify="flex-start" gap="md" px="xs">
                  {/* Checkbox para desselecionar ou gerenciar o estado global */}
                  <Checkbox
                    onChange={toggleAll}
                    checked={selectedRows.length === data.length}
                    indeterminate={selectedRows.length > 0 && selectedRows.length !== data.length}
                    aria-label="Select all rows"
                  />
                  
                  {/* Botão da lixeira logo no comecinho, pertinho do checkbox */}
                  <ActionIcon
                    variant="filled"
                    color="red"
                    size="sm"
                    onClick={() => handleDelete(selectedRows)}
                    title="Excluir selecionados"
                  >
                    <IconTrash size={32} />
                  </ActionIcon>

                  {/* Texto indicativo da quantidade */}
                  <Text size="sm" fw={600}>
                    {selectedRows.length} selecionado(s)
                  </Text>
                </Group>
              </Table.Th>
            ) : (
              // Cabeçalho normal padrão
              <>
                <Table.Th style={{ width: 40 }}>
                  <Checkbox
                    onChange={toggleAll}
                    checked={selectedRows.length === data.length}
                    indeterminate={selectedRows.length > 0 && selectedRows.length !== data.length}
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
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}