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
                total_leads,
                search_status
            )
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            search.municipio,
            search.setor,
            search.total_correspondencias,
            search.total_empresas,
            search.total_leads,
            search.search_status
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
                search_status,
                timestamp
            FROM searches
            ORDER BY timestamp DESC, id DESC
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
                search_status=row[6],
                timestamp=row[7]

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
                total_leads = %s,
                search_status = %s
            WHERE id = %s
        """, (
            search.municipio,
            search.setor,
            search.total_correspondencias,
            search.total_empresas,
            search.total_leads,
            search.search_status,
            search.id,
        ))

        banco.commit()
        cursor.close()


    def delete_many(self, banco, ids: list[int]) -> list[int]:
        cursor = banco.cursor()

        cursor.execute("""
            DELETE FROM searches
            WHERE id = ANY(%s)
            RETURNING id
        """, (ids,))

        deleted_ids = [row[0] for row in cursor.fetchall()]

        banco.commit()

        return deleted_ids


    def find_searches_ids_by_parameter(self, banco, municipio, setor) -> list[int]:
        cursor = banco.cursor()

        cursor.execute("""
        SELECT
            id
        FROM searches 
        WHERE municipio = %s
            AND setor = %s
        """, (municipio, setor))

        rows = cursor.fetchall()

        return [row[0] for row in rows]


    def find_by_ids(self, banco, ids: list[int]) -> list[Search]:
        cursor = banco.cursor()

        cursor.execute("""
            SELECT
                id,
                municipio,
                setor,
                total_correspondencias,
                total_empresas,
                total_leads,
                search_status,
                timestamp
            FROM searches
            WHERE id = ANY(%s)
            ORDER BY timestamp DESC, id DESC
        """, (ids,))

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
                search_status=row[6],
                timestamp=row[7]
            )

            searches.append(search)

        cursor.close()

        return searches
