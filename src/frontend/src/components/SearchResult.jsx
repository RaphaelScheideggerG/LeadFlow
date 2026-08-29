import { Alert, Stack, Text } from '@mantine/core';

export default function SearchResult({ resultado }) {
  if (!resultado) {
    return null;
  }

  return (
    <Alert
      variant="light"
      color="cyan"
      title="Busca Finalizada com Sucesso!"
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