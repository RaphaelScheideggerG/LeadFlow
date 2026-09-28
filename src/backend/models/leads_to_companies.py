from pydantic import BaseModel


class LeadsToCompanies(BaseModel):
    ids: list[int]
