import {
    Modal,
    Stack,
    Group,
    Text,
    Divider,
    Button,
} from '@mantine/core';

export default function SearchDetailsModal({
    opened,
    onClose,
    searches,
    onConfirmViewCompanies,
}) {
    if (!searches || searches.length === 0) {
        return null;
    }

    const search = searches[0];

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Detalhes da pesquisa"
            centered
            size="md"
        >
            <Stack gap="md">
                <Stack gap={4}>
                    <Text c="dimmed" size="sm">
                        Município
                    </Text>
                    <Text>{search.municipio}</Text>

                    <Text c="dimmed" size="sm">
                        Setor
                    </Text>
                    <Text>{search.setor}</Text>

                    <Text c="dimmed" size="sm">
                        Status
                    </Text>
                    <Text>{search.search_status}</Text>


                    <Text c="dimmed" size="sm">
                        Data e Hora
                    </Text>
                    <Text>
                        {new Date(search.timestamp).toLocaleString('pt-BR', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                        })}
                    </Text>
                </Stack>

                <Divider />

                <Stack gap="xs">
                    <Text c="dimmed" size="sm">
                        Resultados
                    </Text>

                    <Group justify="space-between">
                        <Text>Correspondências</Text>
                        <Text fw={500}>
                            {search.total_correspondencias}
                        </Text>
                    </Group>

                    <Group justify="space-between">
                        <Text>Empresas</Text>
                        <Text fw={500}>
                            {search.total_empresas}
                        </Text>
                    </Group>

                    <Group justify="space-between">
                        <Text>Leads</Text>
                        <Text fw={500}>
                            {search.total_leads}
                        </Text>
                    </Group>
                </Stack>

                <Divider />

                <Group justify="center">
                    <Button
                        onClick={() => onConfirmViewCompanies(search.id)}
                    >
                        Visualizar empresas
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
