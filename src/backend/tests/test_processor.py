import pytest
from src.backend.data_process.data_processor import DataProcessor


@pytest.fixture
def mock_nomes_existentes():
    # Simulando os nomes que já estariam na sua planilha do Sheets
    return ["Padaria do Zé", "Oficina do Tonho", "MERCADO CENTRAL"]

@pytest.fixture
def mock_resultados_api():
    # Simulando o JSON bagunçado que vem da SerpAPI
    return [
        # 1. Lead NOVO, (deve passar)
        {
            "title": "Pizzaria do Mario",
            "phone": "(11) 9999-9999",
            "type": "Restaurante",
            "rating": 4.8,
            "reviews": 120,
        },
        # 2. Lead JÁ EXISTENTE na planilha (letras minúsculas pra testar a normalização)
        {
            "title": "padaria do zé",
            "phone": "(11) 8888-8888"
        },
        # 3. Lead JÁ EXISTENTE na planilha com espaços sobrando (Mercado Central)
        {
            "title": " Mercado Central "
        },
        # 4. Lead NOVO, (deve passar)
        {
            "title": "Hamburgueria Tech"
        },
        # 5. DUPLICATA NO MESMO LOTE (API manda a mesma Hamburgueria de novo)
        {
            "title": "Hamburgueria Tech"
        },
        # 6. LIXO DA API (Item sem título, deve ser ignorado)
        {
            "phone": "00000000"
        }
    ]

def test_processamento_com_deduplicacao_completa(mock_resultados_api, mock_nomes_existentes):
    processor = DataProcessor()
    
    leads = processor.process(mock_resultados_api, mock_nomes_existentes)
    
    # Verifica se apenas os 2 leads inéditos e válidos passaram
    assert len(leads) == 2
    assert leads[0].nome_empresa == "Pizzaria do Mario"
    assert leads[1].nome_empresa == "Hamburgueria Tech"
    
    # Verifica se a propriedade de estado guardou os nomes barrados corretamente
    # Note que a Hamburgueria só deve ter sido processada (não barrada como 'já existente'), 
    # a segunda ocorrência dela cai no `vistos_no_lote`
    assert processor.duplicated_names == {"padaria do zé", "mercado central"}

def test_processamento_sem_nomes_existentes(mock_resultados_api):
    processor = DataProcessor()
    
    # Testando o cenário onde a planilha tá vazia (passando None)
    leads = processor.process(mock_resultados_api, nomes_existentes=None)
    
    # Devem passar 4 (Pizzaria, Padaria, Mercado e 1 Hamburgueria)
    # A segunda Hamburgueria cai no filtro de `vistos_no_lote`
    assert len(leads) == 4
    assert processor.duplicated_names == set() # Nenhuma duplicata vinda da planilha

def test_extracao_de_nomes_da_planilha(mock_nomes_existentes):
    pass