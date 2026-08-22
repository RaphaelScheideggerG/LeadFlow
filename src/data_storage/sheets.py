import gspread
from google.oauth2.service_account import Credentials

from src.models.lead import Lead


class GoogleSheetsRepository:

    def __init__(self, spreadsheet_name: str, worksheet_name: str):
        scopes = [
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/drive",
        ]

        credentials = Credentials.from_service_account_file(
            "leadflow-key.json",
            scopes=scopes,
        )

        client = gspread.authorize(credentials)

        spreadsheet = client.open(spreadsheet_name)

        self.worksheet = spreadsheet.worksheet(worksheet_name)

    def list_all(self) -> list[Lead]:
        all_rows = self.worksheet.get_all_values()[1:]

        leads = []

        for row in all_rows:
            if not row or not row[0].strip():
                continue

            def get_col(index: int):
                if index < len(row) and row[index] != "":
                    return row[index]
                return None

            avaliacao = self._parse_float(get_col(6))

            raw_qtd = get_col(7)
            quantidade_avaliacoes = int(raw_qtd) if raw_qtd else None

            latitude = self._parse_float(get_col(9))
            longitude = self._parse_float(get_col(10))

            lead = Lead(
                nome_empresa=row[0],
                telefone=get_col(1),
                segmento=get_col(2),
                municipio=get_col(3),
                estado=get_col(4),
                site=get_col(5),
                avaliacao=avaliacao,
                quantidade_avaliacoes=quantidade_avaliacoes,
                endereco=get_col(8),
                latitude=latitude,
                longitude=longitude,
            )

            leads.append(lead)

        return leads

    def save_leads(self, leads: list[Lead]) -> None:
        # Garante a ordem exata das 11 colunas do contrato
        rows = [
            [
                lead.nome_empresa,
                lead.telefone or "",
                lead.segmento or "",
                lead.municipio or "",
                lead.estado or "",
                lead.site or "",
                lead.avaliacao if lead.avaliacao is not None else "",
                lead.quantidade_avaliacoes if lead.quantidade_avaliacoes is not None else "",
                lead.endereco or "",
                lead.latitude if lead.latitude is not None else "",
                lead.longitude if lead.longitude is not None else "",
            ]
            for lead in leads
        ]

        if rows:
            self.worksheet.append_rows(rows)

    def _parse_float(self, value):
        if not value:
            return None

        return float(str(value).replace(",", "."))
