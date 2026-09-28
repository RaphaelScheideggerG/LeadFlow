from pydantic import BaseModel


class LeadDetails(BaseModel):
    ids: list[int]
