from pydantic import BaseModel


class CompanyDetails(BaseModel):
    ids: list[int]