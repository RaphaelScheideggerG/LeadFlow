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
                    search_id,
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
                    %s, %s, %s
                )
                RETURNING id
            """, (
                company.search_id,
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
                search_id,
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
                search_id=row[1],
                nome_empresa=row[2],
                telefone=row[3],
                segmento=row[4],
                ia_score=row[5],
                ia_justificativa=row[6],
                site=row[7],
                avaliacao=row[8],
                quantidade_avaliacoes=row[9],
                endereco=row[10],
                latitude=row[11],
                longitude=row[12],
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
    def delete_many(self, banco, ids: list[int]) -> list[int]:
        cursor = banco.cursor()

        cursor.execute("""
            DELETE FROM companies
            WHERE id = ANY(%s)
            RETURNING id
        """, (ids,))

        deleted_ids = [row[0] for row in cursor.fetchall()]

        banco.commit()

        return deleted_ids

    def find_by_id(self, id: int):
        ...