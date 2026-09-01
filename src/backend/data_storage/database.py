import sqlite3
import os

# Salva o arquivo leadflow.db na mesma pasta data_storage
DB_PATH = os.path.join(os.path.dirname(__file__), "leadflow.db")

def obter_conexao():
    return sqlite3.connect(DB_PATH)

def inicializar_banco():
    conexao = obter_conexao()
    cursor = conexao.cursor()
    
    # Criação da tabela espelhando os exatos atributos do seu Lead
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_empresa TEXT NOT NULL,
        telefone TEXT,
        segmento TEXT,
        ia_score REAL,
        ia_justificativa TEXT,
        site TEXT,
        avaliacao REAL,
        quantidade_avaliacoes INTEGER,
        endereco TEXT,
        latitude REAL,
        longitude REAL,
        linha INTEGER
    )
    """)
    
    conexao.commit()
    conexao.close()