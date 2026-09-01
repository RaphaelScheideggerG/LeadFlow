from fastapi import FastAPI

from src.backend.models.company_search import CompanySearch
from src.backend.data_collect.serp_api_collector import CompanyCollector
from src.backend.data_process.data_processor import DataProcessor

from fastapi.middleware.cors import CORSMiddleware

from src.backend.data_storage.database import obter_conexao, inicializar_banco

from src.backend.data_storage.company_repository import CompanyRepository
from src.backend.data_storage.lead_repository import LeadRepository
from src.backend.data_storage.sheets import GoogleSheetsRepository
from src.backend.data_storage.google_sheets_lead_repository import LeadGoogleSheetsRepository

def executar_busca(municipio: str, segmento: str):
    print("=" * 60)
    print("🎯 COLETANDO EMPRESAS")
    print("=" * 60)
    
    banco = obter_conexao()

    company_repo = CompanyRepository()
    lead_repo = LeadRepository()

    data_from_db = company_repo.list_all(banco)

    processor = DataProcessor()

    search_exclusion_list = processor.get_names(data_from_db)

    collector = CompanyCollector(
        municipality=municipio,
        additional_criteria=None,
        names_in_storage=search_exclusion_list,
    )
    if segmento:
        collector.segment = segmento

    raw_results = collector.collect_companies()
    total_bruto = len(raw_results)

    companies = processor.process(
        raw_results,
        nomes_existentes=search_exclusion_list,
    )


    print(f"🧹 {len(companies)} empresas válidas após processamento.")

    saved_companies = company_repo.save_companies(banco, companies)

    print(f"💾 {len(saved_companies)} empresas salvos no banco.")

    leads = processor.get_leads(saved_companies)
    lead_repo.save_leads(banco, leads)

    print(f"💾 {len(leads)} leads gerados.")

    total_salvo = len(saved_companies)
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
        print(f"⚠️ Erro ao salvar na planilha do Google: {e}") # TODO: Depois retorna erro para o front-end
    return total_bruto, total_salvo

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


    company_backfilled_data = processor.backfill(company_data_from_db)
    company_repo.update(banco, company_backfilled_data)
    print(f"💾 Salvando {len(company_backfilled_data)} dados atualizados...")

    lead_backfilled_data = processor.backfill_leads(lead_data_from_db)
    lead_repo.update(banco, lead_backfilled_data)
    print(f"💾 Salvando {len(lead_backfilled_data)} leads atualizados")

    print(f"Total no banco: {len(company_data_from_db)} empresas, {len(lead_data_from_db)} leads")
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
        print(f"⚠️ Erro ao salvar na planilha do Google: {e}") # TODO: Depois retorna erro para o front-end
    return len(company_backfilled_data), len(lead_backfilled_data) 


inicializar_banco()
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/companies")
def buscar_companies(search: CompanySearch):

    print(f"Recebido: {search.municipio} / {search.setor}")

    total_bruto, total_salvo = executar_busca(
    search.municipio,
    search.setor
    )

    return {
        "status": "ok",
        "municipio": search.municipio,
        "setor": search.setor,
        "brutos": total_bruto,
        "salvos": total_salvo,
    }

@app.post("/backfill")
def backfill():
    print("🔄 Recebida solicitação de backfill.")

    empresas_atualizadas, leads_atualizados = executar_backfill()

    return {
        "status": "ok",
        "empresas_atualizadas": empresas_atualizadas,
        "leads_atualizados": leads_atualizados,
    }
