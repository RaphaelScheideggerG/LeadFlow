import { useState } from 'react';
import { ScrollArea, Table, ActionIcon, Group } from '@mantine/core';
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

  const handleViewDetails = (search) => {
    console.log('Ver detalhes:', search);
  };

  const handleDelete = (search) => {
    console.log('Deletar:', search);
  };

  const rows = data.map((row) => (
    <Table.Tr key={row.id || row.name}>
      {/* Coluna de Ações na esquerda */}
      <Table.Td>
        <Group gap="xs" wrap="nowrap">
          <ActionIcon
            variant="light"
            color="blue"
            size="sm"
            onClick={() => handleViewDetails(row)}
            title="Ver detalhes"
          >
            <IconEye size={16} />
          </ActionIcon>
          
          <ActionIcon
            variant="light"
            color="red"
            size="sm"
            onClick={() => handleDelete(row)}
            title="Salvar como Lead"
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>

      <Table.Td>{row.id}</Table.Td>
      <Table.Td>{row.municipio}</Table.Td>
      <Table.Td>{row.setor}</Table.Td>
      <Table.Td>{row.total_correspondencias}</Table.Td>
      <Table.Td>{row.total_empresas}</Table.Td>
      <Table.Td>{row.total_leads}</Table.Td>
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
      <Table miw={1300} highlightOnHover stickyHeader>
        <Table.Thead>
          <Table.Tr>
            {/* Cabeçalho para a coluna de Ações */}
            <Table.Th style={{ width: 80 }}>Ações</Table.Th>
            <Table.Th>Id</Table.Th>
            <Table.Th>Municipio</Table.Th>
            <Table.Th>Setor</Table.Th>
            <Table.Th>Correspondencias</Table.Th>
            <Table.Th>Empresas</Table.Th>
            <Table.Th>Leads</Table.Th>
            <Table.Th>Data</Table.Th>


          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
