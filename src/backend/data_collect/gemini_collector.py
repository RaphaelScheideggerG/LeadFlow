import os
from typing import List, Dict, Any
from dotenv import load_dotenv
from google import genai
import os

from backend.models.company import CompanyResponse


# Carregar variáveis de ambiente do arquivo .env
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY não encontrada no .env")

client = genai.Client(api_key=GEMINI_API_KEY)

# Classe para coletar empresas usando Gemini Pro com grounding
class CompanyCollector:
    def __init__(self, segment: str, municipality: str, additional_criteria: str = ""):
        # Criterios de busca
        self.segment = segment
        self.municipality = municipality
        self.additional_criteria = additional_criteria
        self.quantity: int = 1

    def collect_companies(self) -> List[Dict[str, Any]]:
        """
        Coleta empresas usando Gemini Pro com grounding
        
        Args:
            segment: Segmento da indústria (ex: "Tecnologia", "Saúde", "Educação")
            municipality: Município (ex: "São Paulo", "Rio de Janeiro")
            quantity: Quantidade de empresas desejadas
            additional_criteria: Critérios adicionais (ex: "com mais de 50 funcionários")
        
        Returns:
            Lista de dicionários com dados das empresas
        """
        
        prompt = f"""
            Você é um agente especializado em prospecção comercial B2B.

            Sua tarefa é encontrar empresas reais que possam ser potenciais clientes
            de um produto ou serviço, utilizando as informações disponíveis na web.

            Critérios da busca:
            - Segmento: {self.segment}
            - Município: {self.municipality}
            - Quantidade desejada: {self.quantity}
            - Critérios adicionais: {
                self.additional_criteria
                if self.additional_criteria
                else "nenhum"
            }

            Regras:

            1. Pesquise empresas reais e atualmente ativas.
            2. Priorize empresas com presença online verificável.
            3. Não invente empresas, telefones ou outras informações.
            4. Para cada empresa encontrada, procure informações em fontes confiáveis.
            5. Não inclua empresas duplicadas.
            6. O telefone deve ser um telefone comercial publicamente associado à empresa.
            7. Caso não consiga verificar um dado, não invente um valor.
            8. Respeite os critérios de segmento, município e critérios adicionais.
            9. Procure atingir a quantidade solicitada, mas prefira retornar menos
            empresas verificadas a preencher a quantidade com informações duvidosas.

            O objetivo é produzir uma lista de potenciais leads comerciais reais e
            verificáveis.
            """
        
        print(f"🔍 Buscando {self.quantity} empresas em {self.segment} - {self.municipality}...")

        try:
            response = client.interactions.create(
                model="gemini-2.5-flash",
                input=prompt,
                response_format={
                    "type": "text",
                    "mime_type": "application/json",
                    "schema": CompanyResponse.model_json_schema(),
                },
                tools=[
                    {"type": "google_search"}
                ],
            )
        
            # Tentar parsear a resposta JSON usando Pydantic
            companies = CompanyResponse.model_validate_json(response.output_text)
            print(companies)
            """
            try:
                data = response
                if not data or not data.companies:
                    print("⚠️ Nenhuma empresa retornado")
                    return []
                print(data)
                print(data.output_text)
                return data.companies  # Retorna só a lista, não o objeto todo
            except Exception as e:
                print(f"❌ Erro ao parsear: {e}")
                return []
            """

        except Exception as e:
            print(f"❌ Erro ao coletar leads: {str(e)}")
            return []