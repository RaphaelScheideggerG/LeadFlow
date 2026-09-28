import {
    Modal,
    Stack,
    Group,
    Text,
    Divider,
    Collapse,
    ActionIcon,
    Anchor,
} from '@mantine/core';

import {
    IconChevronUp,
    IconChevronDown,
    IconX,
} from '@tabler/icons-react';

import { useDisclosure } from '@mantine/hooks';

export default function CompanyDetailsModal({
    opened,
    onClose,
    companies,
}) {
    const [expanded, { toggle }] = useDisclosure(false);

    if (!companies || companies.length === 0) {
        return null;
    }

    const company = companies[0]; // Ajuste temporário, depois trocar para suportar visualização múltipla

    const renderValue = (value) => {
        if (value === null || value === undefined || value === '') {
            return (
                <IconX
                    size={18}
                    stroke={1.5}
                    color="gray"
                />
            );
        }

        return value;
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Detalhes da empresa"
            centered
            size="md"
        >
            <Stack gap="md">
                <Stack gap={4}>
                    <Text c="dimmed" size="sm">
                        ID da busca
                    </Text>
                    <Text>{company.search_id}</Text>

                    <Text c="dimmed" size="sm">
                        Nome da empresa
                    </Text>
                    <Text>{company.nome_empresa}</Text>

                    <Text c="dimmed" size="sm">
                        Telefone
                    </Text>
                    <Text>
                        {renderValue(company.telefone)}
                    </Text>

                    <Text c="dimmed" size="sm">
                        Segmento
                    </Text>
                    <Text>
                        {renderValue(company.segmento)}
                    </Text>

                    <Divider />

                    <Text c="dimmed" size="sm">
                        Score de IA
                    </Text>
                    <Text>
                        {renderValue(company.ia_score)}
                    </Text>

                    <Group gap="xs">
                        <Text c="dimmed" size="sm">
                            Justificativa da IA
                        </Text>

                        <ActionIcon
                            variant="transparent"
                            size="sm"
                            onClick={toggle}
                            aria-label="Mostrar justificativa da IA"
                        >
                            {expanded ? (
                                <IconChevronUp size={16} />
                            ) : (
                                <IconChevronDown size={16} color="gray"/>
                            )}
                        </ActionIcon>
                    </Group>

                    <Collapse expanded={expanded}>
                        <Text size="sm">
                            {renderValue(company.ia_justificativa)}
                        </Text>
                    </Collapse>

                    <Divider />

                    <Text c="dimmed" size="sm">
                        Site
                    </Text>

                    {company.site ? (
                        <Anchor
                            href={company.site}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                        >
                            {company.site}
                        </Anchor>
                    ) : (
                        <Text>
                            {renderValue(company.site)}
                        </Text>
                    )}
                    
                    <Divider/>

                    <Text c="dimmed" size="sm">
                        Endereço
                    </Text>
                    <Text>
                        {renderValue(company.endereco)}
                    </Text>

                    <Text c="dimmed" size="sm">
                        Avaliação
                    </Text>
                    <Text>
                        {renderValue(company.avaliacao)}
                    </Text>

                    <Text c="dimmed" size="sm">
                        Avaliações
                    </Text>
                    <Text>
                        {renderValue(company.quantidade_avaliacoes)}
                    </Text>

                    <Text c="dimmed" size="sm">
                        Latitude e longitude
                    </Text>
                    <Text>
                        {company.latitude != null &&
                        company.longitude != null
                            ? `${company.latitude}, ${company.longitude}`
                            : (
                                <IconX
                                    size={18}
                                    stroke={1.5}
                                    color="gray"
                                />
                            )}
                    </Text>

                    <Text c="dimmed" size="sm">
                        Data e hora
                    </Text>
                    <Text>
                        {company.timestamp
                            ? new Date(company.timestamp).toLocaleString(
                                'pt-BR',
                                {
                                    dateStyle: 'short',
                                    timeStyle: 'short',
                                }
                            )
                            : (
                                <IconX
                                    size={18}
                                    stroke={1.5}
                                    color="gray"
                                />
                            )}
                    </Text>
                </Stack>

                <Divider />
            </Stack>
        </Modal>
    );
}
