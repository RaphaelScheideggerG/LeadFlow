import { Alert, Stack, Text } from '@mantine/core';

export default function FeedbackAlert({ resultado }) {
  if (!resultado) {
    return null;
  }

  if (resultado.tipo === "erro") {
    return (
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
            ⚠️ {resultado.mensagem}
          </Text>
        </Stack>
      </Alert>
    );
  }

  if (resultado.tipo === "backfill") {
    return (
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
            🔄 Leads processados: <b>{resultado.atualizados}</b>
          </Text>
        </Stack>
      </Alert>
    );
  }

  return (
    <Alert
      variant="light"
      color="cyan"
      w="100%"
    >
      <Stack gap={4}>
        <Text size="sm">
          🔍 Busca bruta: <b>{resultado.brutos}</b> empresas
        </Text>

        <Text size="sm">
          ✨ Novos leads: <b>{resultado.salvos}</b>
        </Text>
      </Stack>
    </Alert>
  );
}