from pathlib import Path

import psycopg2


def obter_conexao():
    return psycopg2.connect(
        host="localhost",
        port=5432,
        dbname="leadflow_db",
        user="postgres",
        password="postgres"
    )


def inicializar_banco():
    schema_path = Path(__file__).parent / "schema.sql"

    schema = schema_path.read_text(encoding="utf-8")

    conexao = obter_conexao()
    cursor = conexao.cursor()

    cursor.execute(schema)

    conexao.commit()

    cursor.close()
    conexao.close()
