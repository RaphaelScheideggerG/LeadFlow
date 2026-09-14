from src.backend.models.lead import Lead
from src.backend.models.lead import LeadResult


class LeadRepository:

    def save_leads(self, banco, leads: list[Lead]) -> None:
        cursor = banco.cursor()

        cursor.executemany("""
            INSERT INTO leads (
                company_id,
                ia_score,
                ia_justificativa
            )
            VALUES (%s, %s, %s)
        """, [
            (
                lead.company_id,
                lead.ia_score,
                lead.ia_justificativa
            )
            for lead in leads
        ])

        banco.commit()

    def list_all(self, banco) -> list[Lead]:
        cursor = banco.cursor()

        cursor.execute("""
            SELECT
                id,
                company_id,
                ia_score,
                ia_justificativa
            FROM leads
        """)

        rows = cursor.fetchall()

        leads = []

        for row in rows:
            lead = Lead(
                id=row[0],
                company_id=row[1],
                ia_score=row[2],
                ia_justificativa=row[3]
            )

            leads.append(lead)

        return leads

    def update(self, banco, leads: list[Lead]):
        cursor = banco.cursor()

        cursor.executemany("""
            UPDATE leads
            SET
                company_id = %s,
                ia_score = %s,
                ia_justificativa = %s
            WHERE id = %s
        """, [
            (
                lead.company_id,
                lead.ia_score,
                lead.ia_justificativa,
                lead.id
            )
            for lead in leads
        ])

        banco.commit()


    def list_all_with_company(self, banco) -> list[LeadResult]:
        cursor = banco.cursor()

        cursor.execute("""
            SELECT
                leads.id,
                leads.company_id,
                companies.nome_empresa,
                leads.ia_score,
                leads.ia_justificativa
            FROM leads
            JOIN companies
                ON leads.company_id = companies.id
        """)

        rows = cursor.fetchall()

        leads = []

        for row in rows:
            lead = LeadResult(
                id=row[0],
                company_id=row[1],
                nome_empresa=row[2],
                ia_score=row[3],
                ia_justificativa=row[4]
            )

            leads.append(lead)

        return leads

    def delete_many(self, banco, ids: list[int]) -> list[int]:
        cursor = banco.cursor()

        cursor.execute("""
            DELETE FROM leads
            WHERE id = ANY(%s)
            RETURNING id
        """, (ids,))

        deleted_ids = [row[0] for row in cursor.fetchall()]

        banco.commit()

        return deleted_ids
