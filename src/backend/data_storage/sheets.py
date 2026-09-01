import gspread
from google.oauth2.service_account import Credentials

from src.backend.models.company import Company


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

    def list_all(self) -> list[Company]:
        rows = self.worksheet.get_all_values()[1:]

        companies = []

        for row_index, row in enumerate(rows, start=2):
            if not row or not row[0].strip():
                continue

            companies.append(
                Company(
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

        return companies

    def save_companies(self, companies: list[Company]) -> None:
        rows = [self._company_to_row(company) for company in companies]

        if rows:
            self.worksheet.append_rows(rows)

    def update_company(self, company: Company) -> None:
        if company.linha is None:
            return

        # Atualiza linha por linha chamando a api para **cada linha**
        self.worksheet.update(
            f"A{company.linha}:K{company.linha}",
            [self._company_to_row(company)],
        )

    def update_companies(self, companies: list[Company]) -> None:
        rows = [
            [
                company.nome_empresa or "",
                company.telefone or "",
                company.segmento or "",
                company.ia_score if company.ia_score is not None else "",
                company.ia_justificativa or "",
                company.site or "",
                company.avaliacao if company.avaliacao is not None else "",
                company.quantidade_avaliacoes
                    if company.quantidade_avaliacoes is not None else "",
                company.endereco or "",
                company.latitude if company.latitude is not None else "",
                company.longitude if company.longitude is not None else "",
            ]
            for company in companies
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
    def _company_to_row(company: Company) -> list:
        return [
            company.nome_empresa,
            company.telefone or "",
            company.segmento or "",
            company.ia_score if company.ia_score is not None else "",
            company.ia_justificativa or "",
            company.site or "",
            company.avaliacao if company.avaliacao is not None else "",
            (
                company.quantidade_avaliacoes
                if company.quantidade_avaliacoes is not None
                else ""
            ),
            company.endereco or "",
            company.latitude if company.latitude is not None else "",
            company.longitude if company.longitude is not None else "",
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