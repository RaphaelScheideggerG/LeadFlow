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
            ORDER BY ia_score DESC, id DESC
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
            ORDER BY ia_score DESC, id DESC
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

    def find_company_ids_by_lead_ids(self, banco, lead_ids: list[int]) -> list[int]:
        cursor = banco.cursor()

        cursor.execute("""
            SELECT company_id
            FROM leads
            WHERE id = ANY(%s)
            ORDER BY id
        """, (lead_ids,))

        rows = cursor.fetchall()

        cursor.close()

        return [row[0] for row in rows]

    def find_by_search_ids(
        self,
        banco,
        search_ids: list[int]
    ) -> list[LeadResult]:

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
            WHERE companies.search_id = ANY(%s)
            ORDER BY leads.ia_score DESC, leads.id DESC
        """, (search_ids,))

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

        cursor.close()

        return leads
