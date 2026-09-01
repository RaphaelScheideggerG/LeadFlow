import os

import serpapi
from dotenv import load_dotenv


load_dotenv()

SERPAPI_KEY = os.getenv("SERPAPI_KEY")

if not SERPAPI_KEY:
    raise ValueError("SERPAPI_KEY não encontrada no .env")


class CompanyCollector:

    def __init__(
        self,
        municipality: str,
        quantity: int = 10,
        segment: str = "empresas",
        additional_criteria: str | None = None,
        names_in_storage: list[str] | None = None,
    ):
        self.segment = segment
        self.municipality = municipality
        self.additional_criteria = additional_criteria
        self.quantity = quantity
        self.names_in_storage = names_in_storage

        self.client = serpapi.Client(api_key=SERPAPI_KEY)

    def collect_companies(self) -> list[dict]:
        query = self._build_query()

        print(f"🔍 Buscando empresas: '{query}'...")

        try:
            results = self.client.search(
                {
                    "engine": "google_local",
                    "q": query,
                    "location": f"{self.municipality}, Brazil",
                    "google_domain": "google.com",
                    "hl": "pt-br",
                    "gl": "br",
                }
            )
    
            local_results = results.get("local_results", [])

            if not local_results:
                print("⚠️ Nenhum resultado encontrado.")
                return []

            print(f"✅ {len(local_results)} empresas coletadas.")
            print(f"nome das empresas coletadas: {[company.get('title') for company in local_results]}")
            return local_results

        except Exception as error:
            print(f"❌ Erro ao coletar empresas: {error}")
            return []

    def _build_query(self) -> str:
        query_parts = [self.segment, self.municipality]

        # Adiciona critérios extras se existirem
        if self.additional_criteria:
            query_parts.append(self.additional_criteria)

        # Se existirem nomes na planilha, formata como: -"Empresa A" -"Empresa B"
        if self.names_in_storage:
            exclusions = [f'-"{name}"' for name in self.names_in_storage]
            query_parts.extend(exclusions)

        # Junta tudo com espaços
        return " ".join(query_parts)