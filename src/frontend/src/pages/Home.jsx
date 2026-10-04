import {
  Center,
  Container,
  Stack,
  ActionIcon,
  Card,
} from '@mantine/core';
import { IconMenu2 } from '@tabler/icons-react'

import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';

import LeadFlowHeader from '../components/principal/LeadFlowHeader';
import SearchForm from '../components/principal/SearchForm';
import FeedbackAlert from '../components/principal/FeedbackAlert';
import SideMenu from '../components/SideMenu';

import { useSearchCompanies, 
  useIsSearchingCompanies, 
  useLastSearchResult 
} from '../mutations/useSearchCompanies';

import {
  useBackfillCompanies,
  useIsBackfillingCompanies,
  useLastBackfillResult,
} from '../mutations/useBackfillCompanies';


export default function Home() {
  const [municipio, setMunicipio] = useState("");
  const [setor, setSetor] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  
  const searchMutation = useSearchCompanies();
  const isSearching = useIsSearchingCompanies();
  const lastSearchResult = useLastSearchResult();
  
  const backfillMutation = useBackfillCompanies();
  const isBackfilling = useIsBackfillingCompanies();
  const lastBackfillResult = useLastBackfillResult();
  
  const loading = isSearching || isBackfilling;


  function runSearch() {
    if (loading) return;

    searchMutation.mutate({
      municipio,
      setor,
    });
  }

  function runBackfill() {
    if (loading) return;

    backfillMutation.mutate();
  }

  return (
      <Center h="100vh">

        <SideMenu opened={opened} onClose={close}/>

        <Card
          shadow="sm"
          padding="xl"
          radius="md"
          withBorder
          w="100%"
          maw={500}
          pos="relative"
        >
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={open}
            pos="absolute"
            top={12}
            left={12}
          >
            <IconMenu2 size={20} />
          </ActionIcon>

          <Container size="sm" w="100%">
            <Stack align="center">


              <LeadFlowHeader />

              <SearchForm
                municipio={municipio}
                setor={setor}
                setMunicipio={setMunicipio}
                setSetor={setSetor}
                loading={loading}
                onSearch={runSearch}
                onBackfill={runBackfill}
              />

              <FeedbackAlert 
                resultadoBusca={lastSearchResult} 
                resultadoBackfill={lastBackfillResult} 
              />

            </Stack>
          </Container>
        </Card>
      </Center>
  );
}