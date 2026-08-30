import gspread
from google.oauth2.service_account import Credentials

from src.backend.models.lead import Lead


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
        rows = self.worksheet.get_all_values()[1:]

        leads = []

        for row_index, row in enumerate(rows, start=2):
            if not row or not row[0].strip():
                continue

            leads.append(
                Lead(
                    nome_empresa=row[0],
                    telefone=self._get_col(row, 1),
                    segmento=self._get_col(row, 2),
                    ia_score=self._parse_float(self._get_col(row, 3)),
                    ia_justificativa=self._get_col(row, 4),
                    site=self._get_col(row, 5),
                    avaliacao=self._parse_float(self._get_col(row, 6)),
                    quantidade_avaliacoes=self._parse_int(self._get_col(row, 7)),
                    endereco=self._get_col(row, 8),
                    latitude=self._parse_float(self._get_col(row, 9)),
                    longitude=self._parse_float(self._get_col(row, 10)),
                    linha=row_index,
                )
            )

        return leads

    def save_leads(self, leads: list[Lead]) -> None:
        rows = [self._lead_to_row(lead) for lead in leads]

        if rows:
            self.worksheet.append_rows(rows)

    def update_lead(self, lead: Lead) -> None:
        if lead.linha is None:
            return

        # Atualiza linha por linha chamando a api para **cada linha**
        self.worksheet.update(
            f"A{lead.linha}:K{lead.linha}",
            [self._lead_to_row(lead)],
        )

    def update_leads(self, leads: list[Lead]) -> None:
        rows = [
            [
                lead.nome_empresa,
                lead.telefone or "",
                lead.segmento or "",
                lead.ia_score if lead.ia_score is not None else "",
                lead.ia_justificativa or "",
                lead.site or "",
                lead.avaliacao if lead.avaliacao is not None else "",
                lead.quantidade_avaliacoes
                    if lead.quantidade_avaliacoes is not None else "",
                lead.endereco or "",
                lead.latitude if lead.latitude is not None else "",
                lead.longitude if lead.longitude is not None else "",
            ]
            for lead in leads
        ]

        if not rows:
            return

        self.worksheet.update(
            f"A2:K{len(rows) + 1}",
            rows,
        )

    """
    Métodos auxiliares
    """
    @staticmethod
    def _lead_to_row(lead: Lead) -> list:
        return [
            lead.nome_empresa,
            lead.telefone or "",
            lead.segmento or "",
            lead.ia_score if lead.ia_score is not None else "",
            lead.ia_justificativa or "",
            lead.site or "",
            lead.avaliacao if lead.avaliacao is not None else "",
            (
                lead.quantidade_avaliacoes
                if lead.quantidade_avaliacoes is not None
                else ""
            ),
            lead.endereco or "",
            lead.latitude if lead.latitude is not None else "",
            lead.longitude if lead.longitude is not None else "",
        ]

    @staticmethod
    def _get_col(row: list, index: int):
        if index < len(row) and row[index] != "":
            return row[index]

        return None

    @staticmethod
    def _parse_float(value):
        if not value:
            return None

        return float(str(value).replace(",", "."))

    @staticmethod
    def _parse_int(value):
        if not value:
            return None

        return int(value)