from src.backend.models.company import Company
from src.backend.data_process.company_scorer import CompanyScorer
from src.backend.data_process.website_resolver import WebSiteResolver
from src.backend.models.lead import Lead


class DataProcessor:
    def __init__(self):
        self.duplicated_names: set[str] = set()
        self.company_scorer = CompanyScorer()
        self.website_resolver = WebSiteResolver()

    def get_names(self, companies: list[Company]) -> list[str]:
        return [
            company.nome_empresa.strip()
            for company in companies
            if company.nome_empresa
        ]

    def process(self, results: list[dict], nomes_existentes: list[str] | None = None) -> list[Company]:
        self._map_duplicates(results, nomes_existentes or [])

        resultados_deduplicados = self._deduplicate(results)
        companies = [self._build_company(item) for item in resultados_deduplicados]

        # Alterar aqui para retornar progresso e.g 5/20 -> 6/20
        return companies

    def backfill_company(self, companies: list[Company]) -> list[Company]:
        for company in companies:
            if company.ia_score is None or company.ia_justificativa is None:
                score = self.company_scorer.evaluate(company)

                if score:
                    company.ia_score = score.ia_score
                    company.ia_justificativa = score.justificativa

            if company.site:
                company.site = self.website_resolver.resolve_website(company.site)

        return companies

    def backfill_leads(self, leads: list[Lead]) -> list[Lead]:
        for lead in leads:
            if lead.ia_score is None or lead.ia_justificativa is None:
                # Aqui você precisaria de uma forma de obter a empresa associada ao lead
                # Isso pode ser feito através de um repositório ou outro mecanismo
                # Por simplicidade, vamos assumir que você tem uma função para isso
                company = self.get_company_by_id(lead.company_id)
                if company:
                    score = self.company_scorer.evaluate(company)
                    if score:
                        lead.ia_score = score.ia_score
                        lead.ia_justificativa = score.justificativa

        return leads

    def get_leads(
        self,
        data: list[Company]
    ) -> list[Lead]:

        leads = []

        for company in data:
            if (
                company.id is not None
                and company.ia_score is not None
                and company.ia_score >= 7.0
            ):
                leads.append(
                    Lead(
                        company_id=company.id,
                        ia_score=company.ia_score,
                        ia_justificativa=company.ia_justificativa
                    )
                )

        return leads

    """
    Funções auxiliares
    """
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

    def _build_company(self, data: dict) -> Company:
        gps = data.get("gps_coordinates") or {}
        links = data.get("links") or {}

        company = Company(
            nome_empresa=data.get("title", "").strip(),

            telefone=data.get("phone"),

            segmento=data.get("type", ""),

            site = self.website_resolver.resolve_website(links.get("website")),

            ia_score=None,
            ia_justificativa=None,

            avaliacao=data.get("rating"),
            quantidade_avaliacoes=data.get("reviews"),

            endereco=data.get("address"),
            latitude=gps.get("latitude"),
            longitude=gps.get("longitude"),
        )

        score = self.company_scorer.evaluate(company)
        
        if score:
            company.ia_score = score.ia_score
            company.ia_justificativa = score.justificativa

        return company
