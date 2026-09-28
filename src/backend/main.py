from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import traceback

from src.backend.data_storage.database import inicializar_banco

from src.backend.models.company_search import CompanySearch

from src.backend.models.search_details import SearchDetails
from src.backend.models.company_details import CompanyDetails
from src.backend.models.leads_to_companies import LeadsToCompanies

from src.backend.services.leadflow_service import (
    executar_busca,
    executar_backfill,

    retornar_buscas,
    retornar_companies,
    retornar_leads,

    excluir_buscas,
    excluir_empresas,
    excluir_leads,

    buscas_detalhes,
    empresas_detalhes,
    empresas_de_leads,
)


inicializar_banco()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/search-companies")
def buscar_companies(search: CompanySearch):
    try:
        total_bruto, total_salvo, total_leads_salvos = executar_busca(
            search.municipio,
            search.setor,
        )

        return {
            "status": "ok",
            "municipio": search.municipio,
            "setor": search.setor,
            "brutos": total_bruto,
            "salvos": total_salvo,
            "leads": total_leads_salvos,
        }
    except Exception as e:
        print(f"⚠️ Erro ao realizar busca: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao realizar busca: {e}"
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
        print(f"⚠️ Erro ao realizar backfill: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Erro ao realizar backfill: {e}"
            )


@app.get("/searches")
def list_searchs():
    try:
        return retornar_buscas()

    except Exception as e:
        print(f"⚠️ Erro ao listar buscas: {e}")

        raise HTTPException(
            status_code=500,
            detail=f"Erro ao listar buscas: {e}"
        )

@app.get("/companies")
def listar_companies():
    try:
        return retornar_companies()

    except Exception as e:
        print(f"⚠️ Erro ao listar companies: {e}")

        raise HTTPException(
            status_code=500,
            detail=f"Erro ao listar companies: {e}"
        )

@app.get("/leads")
def listar_leads():
    try:
        return retornar_leads()

    except Exception as e:
        print(f"⚠️ Erro ao listar leads: {e}")

        raise HTTPException(
            status_code=500,
            detail=f"Erro ao listar leads: {e}"
        )

@app.delete("/delete-searches")
def deletar_buscas(ids: list[int]):
    try:
        deleted_ids = excluir_buscas(ids)
        return deleted_ids
    except Exception as e:
        print(f"⚠️ Erro ao deletar buscas: {e}")

        raise HTTPException(
            status_code=500,
            detail=f"Erro ao deletar buscas: {e}"
        )

@app.delete("/delete-companies")
def deletar_empresas(ids: list[int]):
    try:
        deleted_ids = excluir_empresas(ids)
        return deleted_ids
    except Exception as e:
        print(f"⚠️ Erro ao deletar empresas: {e}")

        raise HTTPException(
            status_code=500,
            detail=f"Erro ao deletar empresas: {e}"
        )

@app.delete("/delete-leads")
def deletar_leads(ids: list[int]):
    try:
        deleted_ids = excluir_leads(ids)
        return deleted_ids
    except Exception as e:
        print(f"⚠️ Erro ao deletar leads: {e}")

        raise HTTPException(
            status_code=500,
            detail=f"Erro ao deletar leads: {e}"
        )


@app.post("/searches-details")
def detalhes_busca(details: SearchDetails):
    try:
        detailed_searches = buscas_detalhes(details.ids)
        return detailed_searches
    except Exception as e:
        print(f"⚠️ Erro ao buscar detalhes: {e}")

        raise HTTPException(
            status_code=500,
            detail=f"Erro ao listar buscas: {e}"
        )

@app.post("/companies-details")
def detalhes_empresas(details: CompanyDetails):
    try:
        detailed_companies = empresas_detalhes(details.ids)
        return detailed_companies

    except Exception as e:
        print(f"⚠️ Erro ao buscar detalhes das empresas: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao listar empresas: {e}"
        )

@app.post("/companies-from-leads")
def detalhes_da_empresas_de_leads(data: LeadsToCompanies):
    try:
        companies = empresas_de_leads(data.ids)
        return companies

    except Exception as e:
        print(f"⚠️ Erro ao buscar empresas dos leads: {e}")

        raise HTTPException(
            status_code=500,
            detail=f"Erro ao buscar empresas dos leads: {e}"
        )
