from pydantic import BaseModel


class LeadSearch(BaseModel):
    municipio: str
    setor: str
