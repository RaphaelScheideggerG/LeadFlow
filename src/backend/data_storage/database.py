import os
from pathlib import Path

import psycopg2
from dotenv import load_dotenv


load_dotenv()

def obter_conexao():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
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
