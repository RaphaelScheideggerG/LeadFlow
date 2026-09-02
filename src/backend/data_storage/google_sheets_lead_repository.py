import gspread

from google.oauth2.service_account import Credentials
from src.backend.models.lead import Lead


class LeadGoogleSheetsRepository:

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

        return [
            Lead(
                id=int(row[0]),
                company_id=int(row[1]),
                ia_score=float(row[2]) if row[2] else None,
                ia_justificativa=row[3] or None,
            )
            for row in rows
            if row and row[0].strip()
        ]

    def save_leads(self, leads: list[Lead]) -> None:
        rows = [
            [
                lead.id or "",
                lead.company_id,
                lead.ia_score if lead.ia_score is not None else "",
                lead.ia_justificativa or "",
            ]
            for lead in leads
        ]

        if rows:
            self.worksheet.append_rows(rows)

    def update_leads(self, leads: list[Lead]) -> None:
        rows = [
            [
                lead.id or "",
                lead.company_id,
                lead.ia_score if lead.ia_score is not None else "",
                lead.ia_justificativa or "",
            ]
            for lead in leads
        ]

        if not rows:
            return

        self.worksheet.update(
            f"A2:D{len(rows) + 1}",
            rows,
        )