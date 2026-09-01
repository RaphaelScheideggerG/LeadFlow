from src.backend.models.lead import Lead


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
