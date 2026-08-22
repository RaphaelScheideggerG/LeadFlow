import pytest
from src.data_collect.gemini_collector import LeadCollector
from src.models.lead import Lead


def test_collector_initialization():
    collector = LeadCollector(segment="Tecnologia", municipality="São Paulo", additional_criteria="com mais de 50 funcionários")
    assert collector.segment == "Tecnologia"
    assert collector.municipality == "São Paulo"
    assert collector.additional_criteria == "com mais de 50 funcionários"

def test_lead_model():
    lead = Lead(
        nome_empresa="Empresa X",
        telefone="+55 11 99999-9999",
        segmento="Tecnologia",
        municipio="São Paulo",
        estado="SP"
    )

    assert isinstance(lead, Lead)
    assert lead.nome_empresa == "Empresa X"
