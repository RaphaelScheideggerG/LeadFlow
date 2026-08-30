from fastapi import FastAPI
from src.backend.models.lead_search import LeadSearch
from src.backend.data_collect.serp_api_collector import LeadCollector
from src.backend.data_storage.sheets import GoogleSheetsRepository
from src.backend.data_process.data_processor import DataProcessor
from fastapi.middleware.cors import CORSMiddleware



def executar_busca(municipio: str, segmento: str):
    print("=" * 60)
    print("🎯 COLETANDO LEADS")
    print("=" * 60)

    sheet = GoogleSheetsRepository(
        spreadsheet_name="LeadFlow",
        worksheet_name="Página1",
    )

    data_from_sheet = sheet.list_all()

    processor = DataProcessor()

    search_exclusion_list = processor.get_names(data_from_sheet)

    collector = LeadCollector(
        municipality=municipio,
        additional_criteria=None,
        names_in_sheet=search_exclusion_list,
    )
    if segmento:
        collector.segment = segmento

    raw_results = collector.collect_leads()
    total_bruto = len(raw_results)

    leads = processor.process(
        raw_results,
        nomes_existentes=search_exclusion_list,
    )

    total_salvo = len(leads)

    print(f"🧹 {len(leads)} leads válidos após processamento.")

    sheet.save_leads(leads)

    print(f"💾 {len(leads)} leads salvos na planilha.")

    return total_bruto, total_salvo

def executar_backfill():
    print("=" * 60)
    print("🎯 REALIZANDO BACKFILL")
    print("=" * 60)

    sheet = GoogleSheetsRepository(
        spreadsheet_name="LeadFlow",
        worksheet_name="Página1",
    )

    data_from_sheet = sheet.list_all()
    print(f"🔄 Atualizando {len(data_from_sheet)} leads...")

    processor = DataProcessor()

    backfilled_data = processor.backfill(data_from_sheet)

    print(f"💾 Salvando {len(backfilled_data)} dados atualizados...")
    sheet.update_leads(backfilled_data)

    return len(data_from_sheet)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/leads")
def buscar_leads(search: LeadSearch):

    print(f"Recebido: {search.municipio} / {search.setor}")

    """
    """
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

    quantidade = executar_backfill()

    return {
        "status": "ok",
        "atualizados": quantidade,
    }
