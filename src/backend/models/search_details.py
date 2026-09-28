from pydantic import BaseModel


class SearchDetails(BaseModel):
    ids: list[int]
