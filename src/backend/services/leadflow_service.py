from src.backend.data_collect.serp_api_collector import CompanyCollector
from src.backend.data_process.data_processor import DataProcessor

from src.backend.data_storage.company_repository import CompanyRepository
from src.backend.data_storage.lead_repository import LeadRepository
from src.backend.data_storage.search_repository import SearchRepository

from src.backend.data_storage.database import obter_conexao

from src.backend.models.search import Search
from src.backend.models.company import Company
from src.backend.models.lead import Lead
from src.backend.models.lead import LeadResult

import os
from dotenv import load_dotenv


def executar_busca(municipio: str, segmento: str):
    print("=" * 60)
    print("🎯 COLETANDO EMPRESAS")
    print("=" * 60)

    # carrega variaveis do env
    load_dotenv()

    # Serp API
    SERPAPI_KEY = os.getenv("SERPAPI_KEY")
    if not SERPAPI_KEY or SERPAPI_KEY == "":
        raise ValueError("SERPAPI_KEY não encontrada")

    # Banco
    banco = obter_conexao()

    # Repositórios
    company_repo = CompanyRepository()
    lead_repo = LeadRepository()
    search_repo = SearchRepository()

    # Processador
    processor = DataProcessor()

    # cria objeto de busca para armazenar no banco
    if not municipio:
        municipio = "Brasília"
    if not segmento:
        segmento = "Tecnologia"

    search = Search(
        municipio=municipio,
        setor=segmento,
    )

    # Salva a busca no banco de dados
    search = search_repo.save_search(banco, search)

    # lista dos ids de buscas que correspondem aos parametros da busca
    ids_list = search_repo.find_searches_ids_by_parameter(banco, municipio, segmento)
    # lista companias existentes no banco
    data_from_db = company_repo.find_by_search_ids(banco, ids_list) 

    # adquire nomes existentes no banco para tentariva de exclusão na busca
    search_exclusion_list = processor.get_names(data_from_db)

    # Coletor
    collector = CompanyCollector(
        municipality=municipio,
        segment=segmento,
        api_key=SERPAPI_KEY,
        names_in_storage=search_exclusion_list
    )

    # realiza a coleta de empresas
    raw_results, search_status, search_error = collector.collect_companies()

    print(60*"-")

    if raw_results:
        print(f"✅ {len(raw_results)} empresas coletadas.")
        print(f"Status da busca: {search_status}")
    else:
        print("⚠️ Nenhum resultado encontrado.")
        print(f"ERROR: {search_error}")

    # armazena quantidade bruta de correspondências encontradas na busca
    total_bruto = len(raw_results)

    # pega os nomes das companias existentes no banco para deduplicação na camada de processamento
    companies_from_db = company_repo.list_all(banco)
    companies_names_from_db = processor.get_names(companies_from_db)

    # processa os resultados da coleta, removendo duplicatas e aplicando regras de negócio
    companies = processor.process(
        raw_results,
        nomes_existentes=companies_names_from_db,
        search_id=search.id,
    )

    # armazena quantidade de empresas válidas após o processamento
    total_empresas_salvas = len(companies)

    print(60*"=")
    print("LOG DE EXECUÇÃO")
    print(60*"=")

    print(f"🧹 {total_empresas_salvas} empresas válidas após processamento.")

    # salva os resultados no banco de dados e retorna a lista de empresas salvas com o id gerado
    saved_companies = company_repo.save_companies(banco, companies)

    print(f"💾 {len(saved_companies)} empresas salvos no banco.")

    # gera leads a partir das empresas salvas
    leads = processor.get_leads(saved_companies)

    # armazena quantidade de leads gerados
    total_leads_salvos = len(leads)

    # salva os leads no banco de dados
    lead_repo.save_leads(banco, leads)

    print(f"💾 {len(leads)} leads gerados.")

    total_empresas_salvas = len(saved_companies)

    # atualiza a busca com os totais de correspondências, empresas e leads
    search.total_correspondencias = total_bruto
    search.total_empresas = total_empresas_salvas
    search.total_leads = total_leads_salvos
    # atualiza a busca no banco
    search_repo.update(banco, search)

    return total_bruto, total_empresas_salvas, total_leads_salvos

def executar_backfill():
    print("=" * 60)
    print("🎯 REALIZANDO BACKFILL")
    print("=" * 60)

    # carrega variaveis do env
    load_dotenv()

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
        f"💾 Salvando {len(companies_backfilled_data)} dados verificados..."
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
