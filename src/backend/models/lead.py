from pydantic import BaseModel


class Lead(BaseModel):
    nome_empresa: str

    telefone: str | None = None

    segmento: str | None = None

    ia_score: float | None = None
    ia_justificativa: str | None = None

    site: str | None = None

    avaliacao: float | None = None
    quantidade_avaliacoes: int | None = None

    endereco: str | None = None

    latitude: float | None = None
    longitude: float | None = None


class LeadResponse(BaseModel):
    leads: list[Lead]
