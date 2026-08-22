# LeadFlow
Pipeline de dados para prospecção de leads com visualização em planilhas no google sheets

---

## Comparação de metodos de extração de dados
### Gemini pro + grounding (paid) x Places API (paid)
| Critério | Gemini Pro (com Grounding) | Places API (v2 / Tradicional) |
| :--- | :--- | :--- |
| **Tipo de Busca** | **Filtros inteligentes:** Você pode pedir "restaurantes bem avaliados que aceitam pets e têm Wi-Fi". | **Filtros rígidos:** Busca por palavras-chave ou categorias exatas da plataforma. |
| **Volume de Dados** | **Baixo:** Excelente para pequenas listas selecionadas (ex: 5 a 10 locais por comando). | **Alto:** Feito para paginação e varredura de centenas de estabelecimentos de uma vez. |
| **Formato de Saída** | **Pronto para uso:** Ele já entrega em formato Markdown, tabela ou JSON limpo se você pedir. | **JSON bruto:** Exige que você programe um script para limpar e extrair os textos. |
| **Velocidade** | **Mais lento:** A IA precisa raciocinar, chamar o mapa e formular o texto. | **Instantâneo:** Resposta direta do banco de dados em milissegundos. |

### Fontes Públicas Gratuitas
- CNPJ/Receita Federal: Site da RF publica dados de empresas registradas (nome, atividade, município)
1. Site: dados abertos.gov.br tem APIs
2. Limitação: não tem tel direto, precisa complementar
3. Prefeituras e Câmaras de Comércio: Alguns municípios publicam registros de empresas licenciadas
    - IBGE: Dados por segmento, município, porte da empresa
    - LinkedIn Sales Navigator: Se o alvo é B2B (empresa para empresa), pode minerar contatos (tem limite de buscas)


### Web Scraping
#### Google Maps
- Google protege bem - Usa JavaScript dinâmico, não retorna dados no HTML inicial
- ToS proíbe - Violar termos de serviço
- Precisa Selenium - Simular browser real (lento, pesado)
- Captchas - Google bloqueia bots facilmente

#### Dados Públicos + Enriquecimento do Dados
- CNPJ API (Receita Federal - dados.gov.br) → Nome, segmento, município
- BeautifulSoup para scraping de páginas amarelas
- LLM free para validar/complementar os dados (sem busca)
- Pode estar desatualizado pois paginhas amarelas está descontinuada

### SerpAPI (Melhor opção)
1. Permite 250 buscas por mes no plano free sem cadastro de conta bancária
2. Respostas totalmente em JSON
3. Possui Google Maps API
4. Suporte legal - U.S. Legal Shield cobre scraping de dados de mecanismos de busca, desde que o uso não seja ilegal

---

## Tratamento dos dados

---

## Armazenamento dos dados

---

## Analise dos dados

---