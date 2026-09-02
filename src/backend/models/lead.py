from pydantic import BaseModel


class Lead(BaseModel):
    id: int | None = None

    company_id: int

    ia_score: float | None = None
    ia_justificativa: str | None = None

class LeadResponse(BaseModel):
    leads: list[Lead]