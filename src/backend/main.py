from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from src.backend.models.company_search import CompanySearch
from src.backend.services.leadflow_service import (
    executar_busca,
    executar_backfill,
)
from src.backend.data_storage.database import inicializar_banco


inicializar_banco()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/companies")
def buscar_companies(search: CompanySearch):
    try:
        total_bruto, total_salvo = executar_busca(
            search.municipio,
            search.setor,
        )

        return {
            "status": "ok",
            "municipio": search.municipio,
            "setor": search.setor,
            "brutos": total_bruto,
            "salvos": total_salvo,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Erro ao buscar empresas: {e}"
            )

@app.post("/backfill")
def backfill():
    try:
        empresas_atualizadas, leads_atualizados = executar_backfill()

        return {
            "status": "ok",
            "empresas_atualizadas": empresas_atualizadas,
            "leads_atualizados": leads_atualizados,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Erro ao realizar backfill: {e}"
            )
