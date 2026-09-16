import serpapi
from fastapi import HTTPException


class CompanyCollector:

    def __init__(
        self,
        municipality: str,
        segment: str,
        api_key: str,
        quantity: int | None = None, # Não em uso para limitação da quantidade (maximo de 20 da API)
        additional_criteria: str | None = None, # Não em uso
        names_in_storage: list[str] | None = None,
    ):
        self.segment = segment
        self.municipality = municipality
        self.additional_criteria = additional_criteria
        self.quantity = quantity
        self.names_in_storage = names_in_storage
        self.api_key = api_key

        self.client = serpapi.Client(api_key=self.api_key)

    def collect_companies(self) -> list[dict]:
        query = self._build_query()

        print(f"🔍 Buscando empresas: '{query}'...")

        try:
            results = self.client.search(
                {
                    "engine": "google_local",
                    "q": query,
                    "location": "Brazil",
                    "google_domain": "google.com",
                    "hl": "pt-br",
                    "gl": "br",
                }
            )
    
            local_results = results.get("local_results", [])

            if not local_results:
                return []

            return local_results

        except serpapi.HTTPError as e:
            if e.status_code == 401:
                raise HTTPException(
                    status_code=401,
                    detail=f"Chave inválida da SerpApi.",
                )

            raise HTTPException(
                status_code=502,
                detail=f"Não foi possível consultar a SerpApi.",
            )

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
