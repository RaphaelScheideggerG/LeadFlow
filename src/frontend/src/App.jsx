import {
  Center,
  Container,
  Stack,
  Card,
} from '@mantine/core';

import { useState } from 'react';

import LeadFlowHeader from './components/LeadFlowHeader';
import SearchForm from './components/SearchForm';
import FeedbackAlert from './components/FeedbackAlert';

export default function App() {
  const [municipio, setMunicipio] = useState("");
  const [setor, setSetor] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  async function run() {
    setLoading(true);
    setResultado(null);

    try {
      const response = await fetch("http://localhost:8000/companies", {
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

      if (!response.ok) {
        throw new Error(data.detail || "Erro ao realizar a busca.");
      }

      setResultado({
        tipo: "busca",
        ...data,
      });

      setTimeout(() => {
        setResultado(null);
      }, 10000);

    } catch (error) {
      console.error("Erro na requisição:", error);

      setResultado({
        tipo: "erro",
        mensagem: error.message,
      });

      setTimeout(() => {
        setResultado(null);
      }, 10000);

    } finally {
      setLoading(false);
    }
  }

  async function runBackfill() {
    setLoading(true);
    setResultado(null);

    try {
      const response = await fetch("http://localhost:8000/backfill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Erro ao realizar o backfill.");
      }

      setResultado({
        tipo: "backfill",
        ...data,
      });

      setTimeout(() => {
        setResultado(null);
      }, 10000);

    } catch (error) {
      console.error("Erro na requisição:", error);

      setResultado({
        tipo: "erro",
        mensagem: error.message,
      });

      setTimeout(() => {
        setResultado(null);
      }, 10000);

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
              onBackfill={runBackfill}
            />

            <FeedbackAlert resultado={resultado} />

          </Stack>
        </Container>
      </Card>
    </Center>
  );
}