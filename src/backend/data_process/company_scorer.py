from src.backend.models.company import Company
from google import genai
from google.genai import types
from src.backend.models.score_output import ScoreOutput
import time


class CompanyScorer:
    def __init__(self):
        self.client = genai.Client()
        self.model_name = "gemini-3.5-flash-lite"
        self.prompt_input = (
        "Você é um especialista em prospecção comercial e qualificação de leads B2B. "

        "Os leads analisados serão utilizados por uma pequena sociedade que busca "
        "oportunidades de freelas e projetos na área de automação e tecnologia. "
        "Portanto, não avalie apenas a maturidade ou o tamanho da empresa. "

        "Seu objetivo é identificar empresas que representem boas oportunidades "
        "comerciais para uma equipe pequena oferecer seus serviços.\n\n"

        "Considere os seguintes critérios:\n"
        "- Possuir site e telefone válidos facilita o contato e aumenta o potencial do lead.\n"
        "- Empresas com alguma presença digital e atividade estabelecida podem representar boas oportunidades.\n"
        "- Empresas muito grandes, extremamente consolidadas ou com forte estrutura podem não ser ideais para uma pequena equipe de freelancers.\n"
        "- Empresas pequenas ou médias podem receber uma pontuação maior quando demonstrarem potencial para contratar serviços externos.\n"
        "- A ausência de site ou de telefone reduz a facilidade de prospecção e deve diminuir o score.\n"
        "- Avaliação e quantidade de avaliações devem ser usadas apenas como indicadores de presença e maturidade do negócio, não como critério absoluto de qualidade.\n"
        "- Analise exclusivamente as informações fornecidas. Não invente características, necessidades ou problemas da empresa.\n\n"

        "Atribua uma pontuação de 0.0 a 10.0 representando o potencial comercial "
        "desse lead para a pequena sociedade. "

        "Além da pontuação, forneça uma justificativa curta, objetiva e baseada "
        "exclusivamente nos dados fornecidos."
        )


    def evaluate(self, lead: Company) -> ScoreOutput | None:
        for attempt in range(3):
            try:
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=(
                        "Analise o seguinte Lead e forneça a pontuação:\n\n"
                        f"{lead.model_dump_json(indent=2)}"
                    ),
                    config=types.GenerateContentConfig(
                        system_instruction=self.prompt_input,
                        response_mime_type="application/json",
                        response_schema=ScoreOutput,
                        temperature=0.1,
                    ),
                )

                return response.parsed

            except Exception as error:
                print(
                    f"⚠️ Erro ao analisar '{lead.nome_empresa}' "
                    f"(tentativa {attempt + 1}/3): {error}"
                )

                if attempt < 2:
                    time.sleep(60)

        return None