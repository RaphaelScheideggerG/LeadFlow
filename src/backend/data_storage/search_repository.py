from src.backend.models.search import Search


class SearchRepository:

    def save_search(self, banco, search: Search) -> Search:
        cursor = banco.cursor()

        cursor.execute("""
            INSERT INTO searches (
                municipio,
                setor,
                total_correspondencias,
                total_empresas,
                total_leads
            )
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """, (
            search.municipio,
            search.setor,
            search.total_correspondencias,
            search.total_empresas,
            search.total_leads
        ))

        search.id = cursor.fetchone()[0]

        banco.commit()
        cursor.close()

        return search

    def list_all(self, banco) -> list[Search]:
        cursor = banco.cursor()

        cursor.execute("""
            SELECT
                id,
                municipio,
                setor,
                total_correspondencias,
                total_empresas,
                total_leads,
                timestamp
            FROM searches
        """)

        rows = cursor.fetchall()

        searches = []

        for row in rows:
            search = Search(
                id=row[0],
                municipio=row[1],
                setor=row[2],
                total_correspondencias=row[3],
                total_empresas=row[4],
                total_leads=row[5],
                timestamp=row[6]
            )

            searches.append(search)

        return searches

    def update(self, banco, search: Search):
        cursor = banco.cursor()

        cursor.execute("""
            UPDATE searches
            SET
                municipio = %s,
                setor = %s,
                total_correspondencias = %s,
                total_empresas = %s,
                total_leads = %s
            WHERE id = %s
        """, (
            search.municipio,
            search.setor,
            search.total_correspondencias,
            search.total_empresas,
            search.total_leads,
            search.id,
        ))

        banco.commit()
        cursor.close()

    def delete(self, banco, search_id: int):
        ...

    def find_by_id(self, banco, id: int) -> Search | None:
        ...


