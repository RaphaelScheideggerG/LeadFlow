import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Qual é a população aproximada de São Paulo? Pesquise na web.",
    config={
        "tools": [
            {"google_search": {}}
        ]
    }
)

print(response.text)
print()
print(response.candidates[0].grounding_metadata)