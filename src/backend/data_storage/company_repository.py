from src.backend.models.company import Company
from psycopg2.extras import execute_values


from src.backend.models.company import Company


class CompanyRepository:

    def save_companies(
        self,
        banco,
        companies: list[Company]
    ) -> list[Company]:
        if not companies:
            return []
        
        cursor = banco.cursor()

        for company in companies:
            cursor.execute("""
                INSERT INTO companies (
                    nome_empresa,
                    telefone,
                    segmento,
                    ia_score,
                    ia_justificativa,
                    site,
                    avaliacao,
                    quantidade_avaliacoes,
                    endereco,
                    latitude,
                    longitude
                )
                VALUES (
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s,
                    %s, %s
                )
                RETURNING id
            """, (
                company.nome_empresa,
                company.telefone,
                company.segmento,
                company.ia_score,
                company.ia_justificativa,
                company.site,
                company.avaliacao,
                company.quantidade_avaliacoes,
                company.endereco,
                company.latitude,
                company.longitude,
            ))

            company.id = cursor.fetchone()[0]

        banco.commit()
        cursor.close()

        return companies

    def list_all(self, banco) -> list[Company]:
        cursor = banco.cursor()

        cursor.execute("""
            SELECT
                id,
                nome_empresa,
                telefone,
                segmento,
                ia_score,
                ia_justificativa,
                site,
                avaliacao,
                quantidade_avaliacoes,
                endereco,
                latitude,
                longitude
            FROM companies
        """)

        rows = cursor.fetchall()

        companies = []

        for row in rows:
            company = Company(
                id=row[0],
                nome_empresa=row[1],
                telefone=row[2],
                segmento=row[3],
                ia_score=row[4],
                ia_justificativa=row[5],
                site=row[6],
                avaliacao=row[7],
                quantidade_avaliacoes=row[8],
                endereco=row[9],
                latitude=row[10],
                longitude=row[11],
            )

            companies.append(company)

        return companies

    def update(self, banco, companies: list[Company]):
        cursor = banco.cursor()

        cursor.executemany("""
            UPDATE companies
            SET
                nome_empresa = %s,
                telefone = %s,
                segmento = %s,
                ia_score = %s,
                ia_justificativa = %s,
                site = %s,
                avaliacao = %s,
                quantidade_avaliacoes = %s,
                endereco = %s,
                latitude = %s,
                longitude = %s
            WHERE id = %s
        """, [
            (
                company.nome_empresa,
                company.telefone,
                company.segmento,
                company.ia_score,
                company.ia_justificativa,
                company.site,
                company.avaliacao,
                company.quantidade_avaliacoes,
                company.endereco,
                company.latitude,
                company.longitude,
                company.id
            )
            for company in companies
        ])

        banco.commit()

    def find_by_name(self, name: str):
        ...