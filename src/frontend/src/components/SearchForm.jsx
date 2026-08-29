import { Stack, Button, TextInput } from '@mantine/core';

export default function SearchForm({
  municipio,
  setor,
  setMunicipio,
  setSetor,
  loading,
  onSearch,
}) {
  return (
    <>
      <TextInput
        label="Município"
        placeholder="Ex.: Brasília"
        value={municipio}
        disabled={loading}
        onChange={(e) => setMunicipio(e.target.value)}
        w="100%"
        styles={{
          label: { textAlign: 'left', width: '100%' },
        }}
      />

      <TextInput
        label="Setor"
        placeholder="Ex.: Tecnologia"
        value={setor}
        disabled={loading}
        onChange={(e) => setSetor(e.target.value)}
        w="100%"
        styles={{
          label: { textAlign: 'left', width: '100%' },
        }}
      />

      <Stack w="100%" gap="sm">
        <Button
          fullWidth
          size="md"
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
          onClick={onSearch}
          loading={loading}
        >
          Buscar leads
        </Button>

        <Button
          fullWidth
          variant="outline"
        >
          Backfill
        </Button>
      </Stack>
    </>
  );
}