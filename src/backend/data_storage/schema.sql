CREATE TABLE IF NOT EXISTS companies (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome_empresa TEXT UNIQUE NOT NULL,
    telefone TEXT,
    segmento TEXT,
    ia_score REAL,
    ia_justificativa TEXT,
    site TEXT,
    avaliacao REAL,
    quantidade_avaliacoes INTEGER,
    endereco TEXT,
    latitude REAL,
    longitude REAL
);

CREATE TABLE IF NOT EXISTS leads (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    company_id BIGINT NOT NULL REFERENCES companies(id),
    ia_score REAL NOT NULL,
    ia_justificativa TEXT
);