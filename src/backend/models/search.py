from pydantic import BaseModel
from datetime import datetime


class Search(BaseModel):
    id: int | None = None
    municipio: str
    setor: str
    total_correspondencias: int | None = 0
    total_empresas: int | None = 0
    total_leads: int | None = 0
    timestamp: datetime | None = None

class SearchResponse(BaseModel):
    searches: list[Search]
