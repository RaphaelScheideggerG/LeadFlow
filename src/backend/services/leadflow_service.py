from src.backend.data_collect.serp_api_collector import CompanyCollector
from src.backend.data_process.data_processor import DataProcessor

from src.backend.data_storage.company_repository import CompanyRepository
from src.backend.data_storage.lead_repository import LeadRepository
from src.backend.data_storage.sheets import GoogleSheetsRepository
from src.backend.data_storage.search_repository import SearchRepository
from src.backend.data_storage.google_sheets_lead_repository import LeadGoogleSheetsRepository

from src.backend.data_storage.database import obter_conexao

from src.backend.models.search import Search
from src.backend.models.company import Company
from src.backend.models.lead import Lead
from src.backend.models.lead import LeadResult


def executar_busca(municipio: str, segmento: str):
    print("=" * 60)
    print("🎯 COLETANDO EMPRESAS")
    print("=" * 60)

    # Banco
    banco = obter_conexao()

    # Repositórios
    company_repo = CompanyRepository()
    lead_repo = LeadRepository()
    search_repo = SearchRepository()

    # Processador
    processor = DataProcessor()

    # cria objeto de busca para armazenar no banco
    search = Search(
        municipio=municipio,
        setor=segmento,
    )

    # Salva a busca no banco de dados
    search = search_repo.save_search(banco, search)

    # lista companias existentes no banco
    data_from_db = company_repo.list_all(banco)

    # adquire nomes existentes no banco para tentariva de exclusão na busca
    search_exclusion_list = processor.get_names(data_from_db)

    # Coletor
    collector = CompanyCollector(
        municipality=municipio,
        additional_criteria=None,
        names_in_storage=search_exclusion_list,
    )
    if segmento:
        collector.segment = segmento

    # realiza a coleta de empresas
    raw_results = collector.collect_companies()

    # armazena quantidade bruta de correspondências encontradas na busca
    total_bruto = len(raw_results)

    # processa os resultados da coleta, removendo duplicatas e aplicando regras de negócio
    companies = processor.process(
        raw_results,
        nomes_existentes=search_exclusion_list,
        search_id=search.id,
    )

    # armazena quantidade de empresas válidas após o processamento
    total_empresas_salvas = len(companies)

    print(f"🧹 {total_empresas_salvas} empresas válidas após processamento.")

    # salva os resultados no banco de dados e retorna a lista de empresas salvas com o id gerado
    saved_companies = company_repo.save_companies(banco, companies)

    print(f"💾 {len(saved_companies)} empresas salvos no banco.")

    # gera leads a partir das empresas salvas
    leads = processor.get_leads(saved_companies)

    # armazena quantidade de leads gerados
    total_lead_gerados = len(leads)

    # salva os leads no banco de dados
    lead_repo.save_leads(banco, leads)

    print(f"💾 {len(leads)} leads gerados.")

    total_empresas_salvas = len(saved_companies)

    # atualiza a busca com os totais de correspondências, empresas e leads
    search.total_correspondencias = total_bruto
    search.total_empresas = total_empresas_salvas
    search.total_leads = total_lead_gerados
    search_repo.update(banco, search)

    # Sincronizar dados no Google Sheets
    try:

        sheet_pag1 = GoogleSheetsRepository(
            spreadsheet_name="LeadFlow",
            worksheet_name="Empresas",
        )
        sheet_pag2 = LeadGoogleSheetsRepository(
            spreadsheet_name="LeadFlow",
            worksheet_name="Leads",
        )

        companies_from_db = company_repo.list_all(banco)
        leads_from_db = lead_repo.list_all(banco)

        sheet_pag1.update_companies(companies_from_db)
        sheet_pag2.update_leads(leads_from_db)

        print(f"💾 {len(companies_from_db)} empresas salvas na planilha do Google")
        print(f"💾 {len(leads_from_db)} leads salvos na planilha do Google")

    except Exception as e:
        print(f"⚠️ Erro ao salvar na planilha do Google: {e}")
        raise

    return total_bruto, total_empresas_salvas

def executar_backfill():
    print("=" * 60)
    print("🎯 REALIZANDO BACKFILL")
    print("=" * 60)

    banco = obter_conexao()

    processor = DataProcessor()
    company_repo = CompanyRepository()
    lead_repo = LeadRepository()

    company_data_from_db = company_repo.list_all(banco)
    lead_data_from_db = lead_repo.list_all(banco)

    companies_backfilled_data, leads_to_save = processor.backfill(
        company_data_from_db,
        lead_data_from_db
    )

    # Atualiza as empresas que passaram pelo backfill
    company_repo.update(banco, companies_backfilled_data)

    print(
        f"💾 Salvando {len(companies_backfilled_data)} dados atualizados..."
    )

    # Adiciona somente os novos leads encontrados
    lead_repo.save_leads(banco, leads_to_save)

    print(
        f"💾 Salvando {len(leads_to_save)} novos leads..."
    )

    print(
        f"Total no banco: "
        f"{len(company_data_from_db)} empresas, "
        f"{len(lead_data_from_db) + len(leads_to_save)} leads"
    )

    try:
        sheet_pag1 = GoogleSheetsRepository(
            spreadsheet_name="LeadFlow",
            worksheet_name="Empresas",
        )

        sheet_pag2 = LeadGoogleSheetsRepository(
            spreadsheet_name="LeadFlow",
            worksheet_name="Leads",
        )

        companies_from_db = company_repo.list_all(banco)
        leads_from_db = lead_repo.list_all(banco)

        sheet_pag1.update_companies(companies_from_db)
        sheet_pag2.update_leads(leads_from_db)

        print(
            f"💾 {len(companies_from_db)} empresas "
            "sincronizadas na planilha do Google"
        )

        print(
            f"💾 {len(leads_from_db)} leads "
            "sincronizados na planilha do Google"
        )

    except Exception as e:
        print(f"⚠️ Erro ao salvar na planilha do Google: {e}")
        raise

    return len(companies_backfilled_data), len(leads_to_save)


def retornar_buscas() -> list[Search]:
    banco = obter_conexao()

    search_repo = SearchRepository()
    buscas = search_repo.list_all(banco)

    return buscas

def retornar_companies() -> list[Company]:
    banco = obter_conexao()

    company_repo = CompanyRepository()
    companies = company_repo.list_all(banco)

    return companies

def retornar_leads() -> list[LeadResult]:
    banco = obter_conexao()

    lead_repo = LeadRepository()
    leads = lead_repo.list_all_with_company(banco)

    return leads


def excluir_buscas(ids: list[int]) -> list[Search]:
    banco = obter_conexao()

    search_repo = SearchRepository()
    deleted = search_repo.delete_many(banco, ids)
    return deleted

def excluir_empresas(ids: list[int]) -> list[Company]:
    banco = obter_conexao()

    company_repo = CompanyRepository()
    deleted = company_repo.delete_many(banco, ids)
    return deleted

def excluir_leads(ids: list[int]) -> list[Lead]:
    banco = obter_conexao()

    lead_repo = LeadRepository()
    deleted = lead_repo.delete_many(banco, ids)
    return deleted
