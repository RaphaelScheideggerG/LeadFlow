from src.backend.models.lead import Lead
from src.backend.data_process.lead_scorer import LeadScorer
from src.backend.data_process.website_resolver import WebSiteResolver


class DataProcessor:
    def __init__(self):
        self.duplicated_names: set[str] = set()
        self.lead_scorer = LeadScorer()
        self.resolve_website = WebSiteResolver()

    def get_names(self, leads: list[Lead]) -> list[str]:
        return [
            lead.nome_empresa.strip()
            for lead in leads
            if lead.nome_empresa
        ]

    def process(self, results: list[dict], nomes_existentes: list[str] | None = None) -> list[Lead]:
        self._map_duplicates(results, nomes_existentes or [])

        resultados_deduplicados = self._deduplicate(results)

        return [self._build_lead(data) for data in resultados_deduplicados]

    def _map_duplicates(self, results: list[dict], nomes_existentes: list[str]) -> None:
        self.duplicated_names.clear()  # Limpa o estado para evitar vazamento entre execuções
        existentes_set = {nome.strip().lower() for nome in nomes_existentes}

        for item in results:
            nome = item.get("title", "").strip().lower()
            # Se o nome retornado pela API já estiver na nossa planilha, marcamos como duplicado
            if nome and nome in existentes_set:
                self.duplicated_names.add(nome)

    def _deduplicate(self, results: list[dict]) -> list[dict]:
        resultados_unicos = []
        vistos_no_lote = set() # Para evitar duplicatas que vêm repetidas na própria resposta da API

        for item in results:
            nome = item.get("title", "").strip().lower()

            # Pula se for vazio, se estiver na nossa propriedade de duplicados, ou se repetiu no mesmo lote
            if not nome or nome in self.duplicated_names or nome in vistos_no_lote:
                continue
 
            vistos_no_lote.add(nome)
            resultados_unicos.append(item)

        return resultados_unicos

    def _build_lead(self, data: dict) -> Lead:
        print(data)
        gps = data.get("gps_coordinates") or {}
        links = data.get("links") or {}

        lead = Lead(
            nome_empresa=data.get("title", "").strip(),

            telefone=data.get("phone"),

            segmento=data.get("type", ""),

            site = self.resolve_website.resolve_website(links.get("website")),

            ia_score=None,
            ia_justificativa=None,

            avaliacao=data.get("rating"),
            quantidade_avaliacoes=data.get("reviews"),

            endereco=data.get("address"),
            latitude=gps.get("latitude"),
            longitude=gps.get("longitude"),
        )

        score = self.lead_scorer.evaluate(lead)
        
        if score:
            lead.ia_score = score.ia_score
            lead.ia_justificativa = score.justificativa

        return lead