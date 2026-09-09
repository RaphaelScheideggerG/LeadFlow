import { useState } from 'react';
import { ScrollArea, Table, ActionIcon, Group, Checkbox, Text } from '@mantine/core';
import { IconEye, IconTrash } from '@tabler/icons-react';

const mockData = [
  {
    id: 13,
    search_id: 4,
    name: 'Consulnet TI',
    phone: '(61) 99574-6793',
    segment: 'Empresa de Software',
    score: 6.5,
    justification:
      'A empresa atua no segmento de software e possui telefone válido, mas a ausência de site reduz o potencial de prospecção digital e a baixa quantidade de avaliações indica porte menor.',
    website: null,
    rating: 4,
    reviews: 1,
    address: 'SHS Q. 6 BL C',
    latitude: -15.802725,
    longitude: -47.879597,
  },
  {
    id: 1,
    search_id: 4,
    name: 'B12 informática - Empresa de TI - Empresa de informática - Suporte de TI',
    phone: '(61) 99571-5050',
    segment: 'Suporte e serviços para computadores',
    score: 5.5,
    justification:
      'A empresa possui site, telefone válido e boa presença digital com 155 avaliações, mas por atuar no segmento de TI e informática, pode ter capacidade interna para demandas de tecnologia, limitando a necessidade de serviços externos de freelancers.',
    website: 'https://b12informatica.com.br/',
    rating: 5,
    reviews: 155,
    address:
      'Mais de 7 anos no mercado · SCS Q. 2 Ed. Serra Dourada Sl 302',
    latitude: -15.796548,
    longitude: -47.889713,
  },
  {
    id: 2,
    search_id: 4,
    name: 'Central IT – Tecnologia em Negócios',
    phone: '(61) 3030-4000',
    segment: 'Serviço de informática',
    score: 5,
    justification:
      'A empresa possui site, telefone válido e boa presença digital no setor de informática, mas seu porte consolidado (mais de 20 anos de mercado) pode indicar menor abertura para serviços pontuais de uma equipe pequena.',
    website: 'https://www.centralit.com.br/',
    rating: 4.6,
    reviews: 101,
    address:
      'Mais de 20 anos no mercado · 17º Andar - Setor Hoteleiro Norte – Qd. 2 – Bloco F – Ed. Executive Office Tower',
    latitude: -15.790159,
    longitude: -47.887306,
  },
  {
    id: 3,
    search_id: 4,
    name: 'Grupo IDEIA Tecnologia da Informação',
    phone: '(61) 3995-0668',
    segment: 'Suporte e serviços para computadores',
    score: 8.5,
    justification:
      'A empresa possui site, telefone válido e atuação na área de tecnologia com bom tempo de mercado, representando um perfil de porte adequado e facilidade de contato para uma pequena equipe.',
    website: 'https://grupoideia.inf.br/',
    rating: 4.9,
    reviews: 54,
    address:
      'Mais de 15 anos no mercado · Setor Hoteleiro Sul, Quadra 1, Entrada A, Sala 1414 Sala 1414',
    latitude: -15.790793,
    longitude: -47.8854,
  },
  {
    id: 4,
    search_id: 4,
    name: 'Logus TI Treinamento em Informática',
    phone: '(61) 3244-5000',
    segment: 'Escola de informática',
    score: 8.5,
    justification:
      'A empresa possui site válido, telefone e boa presença digital com avaliações consistentes. Por ser uma escola de informática de porte médio, apresenta excelente alinhamento e potencial para contratar serviços externos de automação e tecnologia de uma pequena equipe.',
    website: 'https://www.logusti.com.br/',
    rating: 4.7,
    reviews: 53,
    address:
      'Mais de 10 anos no mercado · SCS Quadra 02 Bloco C loja 246 Térreo 246, SHCS',
    latitude: -15.797361,
    longitude: -47.887177,
  },
  {
    id: 5,
    search_id: 4,
    name: 'Things IT - Soluções em TI',
    phone: '(61) 3344-4275',
    segment: null,
    score: 8,
    justification:
      'A empresa possui site e telefone válidos, além de atuar diretamente no segmento de TI, o que facilita o contato e indica maior abertura para projetos de automação e tecnologia adequados para uma equipe de freelancers.',
    website: 'http://www.thingsit.com.br/home/',
    rating: null,
    reviews: null,
    address:
      'SHS, quadra 06, Bloco A, Sala 501, Brasil 21 - Brasília/DF, CEP 70.316, 102, SHCS',
    latitude: -15.793156,
    longitude: -47.892982,
  },
  {
    id: 6,
    search_id: 4,
    name: 'TEC21 - Soluções em TI',
    phone: '(61) 99178-1595',
    segment: 'Empresa de Software',
    score: 5,
    justification:
      'A empresa possui telefone válido, mas a ausência de site limita a análise digital. Por ser uma empresa de software de pequeno porte, pode representar uma oportunidade para parcerias em projetos, embora a falta de presença online reduza a facilidade de prospecção.',
    website: null,
    rating: 5,
    reviews: 1,
    address: 'Setor Comercial Sul Q. 2 Scs',
    latitude: -15.797234,
    longitude: -47.886692,
  },
  {
    id: 7,
    search_id: 4,
    name: 'MegaTeam Serviços de TI',
    phone: '(61) 3326-8334',
    segment: 'Serviço de informática',
    score: 7.5,
    justification:
      'A empresa possui site válido, telefone de contato e mais de 10 anos de mercado no segmento de informática, representando uma boa oportunidade comercial de porte adequado para uma equipe pequena.',
    website: 'https://megateam.com.br/',
    rating: 5,
    reviews: 1,
    address:
      'Mais de 10 anos no mercado · SHN Quadra 01 Conjunto A Bloco A Ed. Le Quartier - 5º andar Sala 523',
    latitude: -15.790857,
    longitude: -47.88522,
  },
  {
    id: 8,
    search_id: 4,
    name: '3P Systems Tecnologia',
    phone: '(61) 99349-4444',
    segment: 'Empresa de Software',
    score: 8.5,
    justification:
      'A empresa possui site válido, telefone e atua no segmento de software, o que indica alinhamento com a área de tecnologia e potencial para demandas de automação ou projetos para uma equipe pequena.',
    website: 'https://www.3psystems.com/',
    rating: 5,
    reviews: 6,
    address:
      'SHS QD 06 CJ A BL A, SALA 501 - Complexo Brasil 21, SHCS',
    latitude: -15.793018,
    longitude: -47.892925,
  },
  {
    id: 9,
    search_id: 4,
    name: 'Versátil - Escola de Ti de Brasília',
    phone: '(61) 97401-3340',
    segment: 'Escola de informática',
    score: 7.5,
    justification:
      'A empresa possui site válido, telefone e tempo de mercado estabelecido, além de ser do segmento de tecnologia, o que facilita a abordagem por uma equipe focada em automação.',
    website: 'https://www.versatilti.com.br/',
    rating: 4.7,
    reviews: 45,
    address:
      'Mais de 25 anos no mercado · SEPN 509 Bloco D Edifício ISIS, Sala 104',
    latitude: -15.760949,
    longitude: -47.891453,
  },
  {
    id: 10,
    search_id: 4,
    name: 'CTIS Tecnologia SA - Filial SONDA',
    phone: '(61) 3212-9500',
    segment: 'Escritório da empresa',
    score: 2.5,
    justification:
      'A empresa é de grande porte e filial de um grupo consolidado (Sonda), o que foge do perfil ideal para uma pequena sociedade de freelancers. Além disso, não possui site informado, dificultando o contato.',
    website: null,
    rating: 4.1,
    reviews: 156,
    address: 'BL A - Qd. 8, B60, Via S2',
    latitude: -15.795267,
    longitude: -47.892822,
  },
];

export default function LeadTable({ data = mockData }) {
  const [scrolled, setScrolled] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleViewDetails = (lead) => {
    console.log('Ver detalhes:', lead);
  };

  const handleDelete = (leads) => {
    console.log('Deletar leads selecionados:', leads);
  };

  const toggleRow = (id) =>
    setSelectedRows((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );

  const toggleAll = () =>
    setSelectedRows((current) =>
      current.length === data.length ? [] : data.map((item) => item.id)
    );

  const rows = data.map((row) => (
    <Table.Tr
      key={row.id}
      bg={selectedRows.includes(row.id) ? 'var(--mantine-color-blue-light)' : undefined}
      style={{ cursor: 'pointer' }}
      onClick={() => handleViewDetails(row)}
    >
      {/* Coluna do Checkbox com stopPropagation */}
      <Table.Td onClick={(e) => e.stopPropagation()}>
        <Checkbox
          aria-label="Select row"
          checked={selectedRows.includes(row.id)}
          onChange={() => toggleRow(row.id)}
        />
      </Table.Td>

      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.score}</Table.Td>
      <Table.Td>{row.justification}</Table.Td>
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
            {selectedRows.length > 0 ? (
              // Barra de ações em lote no topo
              <Table.Th colSpan={4} style={{ backgroundColor: 'var(--mantine-color-blue-light)' }}>
                <Group justify="flex-start" gap="md" px="xs">
                  <Checkbox
                    onChange={toggleAll}
                    checked={selectedRows.length === data.length}
                    indeterminate={selectedRows.length > 0 && selectedRows.length !== data.length}
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
                <Table.Th>Name</Table.Th>
                <Table.Th>Score</Table.Th>
                <Table.Th>Justification</Table.Th>
              </>
            )}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
