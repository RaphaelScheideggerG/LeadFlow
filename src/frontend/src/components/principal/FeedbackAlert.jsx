import { Alert, Stack, Text } from '@mantine/core';

export default function FeedbackAlert({ resultadoBusca, resultadoBackfill }) {
  if (!resultadoBusca && !resultadoBackfill) {
    return null;
  }

  return (
    <Stack w="100%">

      {resultadoBusca?.status === 'error' && (
        <Alert
          variant="light"
          color="red"
          w="100%"
        >
          <Stack gap="xs" align="center">
            <Text fw={500} ta="center">
              Erro ao Buscar!
            </Text>

            <Text size="sm" ta="center">
              ❌ Não foi possível concluir a busca.
            </Text>

            <Text size="sm" ta="center">
              ⚠️ {resultadoBusca.error?.message}
            </Text>
          </Stack>
        </Alert>
      )}

      {resultadoBusca?.status === 'success' && (
        <Alert
          variant="light"
          color="cyan"
          w="100%"
        >
          <Stack gap={4}>
            <Text size="sm">
              🔍 Busca bruta:{' '}
              <b>{resultadoBusca.data.brutos}</b> empresas encontradas
            </Text>

            <Text size="sm">
              ✨ Novas Empresas: <b>{resultadoBusca.data.salvos}</b>
            </Text>

            <Text size="sm">
              ✨ Novos Leads: <b>{resultadoBusca.data.leads}</b>
            </Text>
          </Stack>
        </Alert>
      )}

      {resultadoBackfill?.status === 'error' && (
        <Alert
          variant="light"
          color="red"
          w="100%"
        >
          <Stack gap="xs" align="center">
            <Text fw={500} ta="center">
              Erro ao realizar o backfill!
            </Text>

            <Text size="sm" ta="center">
              ❌ Não foi possível concluir o backfill.
            </Text>

            <Text size="sm" ta="center">
              ⚠️ {resultadoBackfill.error?.message}
            </Text>
          </Stack>
        </Alert>
      )}

      {resultadoBackfill?.status === 'success' && (
        <Alert
          variant="light"
          color="cyan"
          w="100%"
        >
          <Stack gap="xs" align="center">
            <Text fw={500} ta="center">
              Backfill Finalizado com Sucesso!
            </Text>

            <Text size="sm" ta="center">
              🔄 <b>{resultadoBackfill.data.empresas_atualizadas}</b>{' '}
              Empresas Verificadas
            </Text>

            <Text size="sm" ta="center">
              🔄 <b>{resultadoBackfill.data.leads_atualizados}</b>{' '}
              Leads Atualizados
            </Text>
          </Stack>
        </Alert>
      )}

    </Stack>
  );
}