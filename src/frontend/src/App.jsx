import {
  Center,
  Container,
  Stack,
  Card,
} from '@mantine/core';

import { useState } from 'react';

import LeadFlowHeader from './components/LeadFlowHeader';
import SearchForm from './components/SearchForm';
import SearchResult from './components/SearchResult';

export default function App() {
  const [municipio, setMunicipio] = useState("");
  const [setor, setSetor] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  async function run() {
    setLoading(true);
    setResultado(null);

    try {
      const response = await fetch("http://localhost:8000/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          municipio,
          setor,
        }),
      });

      const data = await response.json();

      setResultado(data);

      setTimeout(() => {
        setResultado(null);
      }, 5000);

    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Center h="100vh">
      <Card
        shadow="sm"
        padding="xl"
        radius="md"
        withBorder
        w="100%"
        maw={500}
      >
        <Container size="sm" w="100%">
          <Stack align="center">

            <LeadFlowHeader />

            <SearchForm
              municipio={municipio}
              setor={setor}
              setMunicipio={setMunicipio}
              setSetor={setSetor}
              loading={loading}
              onSearch={run}
            />

            <SearchResult resultado={resultado} />

          </Stack>
        </Container>
      </Card>
    </Center>
  );
}