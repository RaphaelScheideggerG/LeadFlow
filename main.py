
from src.data_collect.serp_api_collector import LeadCollector
from src.data_storage.sheets import GoogleSheetsRepository
from src.data_process.data_processor import DataProcessor


def main():
    print("=" * 60)
    print("🎯 COLETOR DE LEADS COM SERPAPI")
    print("=" * 60)

    sheet = GoogleSheetsRepository(
        spreadsheet_name="LeadFlow",
        worksheet_name="Página1",
    )

    data_from_sheet = sheet.list_all()

    processor = DataProcessor()

    search_exclusion_list = processor.get_names(data_from_sheet)

    collector = LeadCollector(
        municipality="Brasilia",
        additional_criteria=None,
        names_in_sheet=search_exclusion_list,
    )

    raw_results = collector.collect_leads()

    leads = processor.process(
        raw_results,
        nomes_existentes=search_exclusion_list,
    )

    print(f"🧹 {len(leads)} leads válidos após processamento.")

    sheet.save_leads(leads)

    print(f"💾 {len(leads)} leads salvos na planilha.")

if __name__ == "__main__":
    main()