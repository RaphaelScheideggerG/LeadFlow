from pydantic import BaseModel, Field

# Schema Pydantic estrito pra força o formato do output da IA
class ScoreOutput(BaseModel):
    ia_score: float = Field(
        description="Nota de 0.0 a 10.0 representando a qualidade do lead para automação.",
        ge=0.0,
        le=10.0,
    )
    justificativa: str = Field(
        description="Explicação curta da pontuação atribuída ao lead."
    )
