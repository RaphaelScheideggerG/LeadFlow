from pydantic import BaseModel


class CompanySearch(BaseModel):
    municipio: str
    setor: str
