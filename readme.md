# LeadFlow

**Pipeline inteligente para prospecção de empresas e geração de leads.**

O **LeadFlow** automatiza parte do processo de prospecção comercial: coleta empresas a partir de buscas locais, normaliza e deduplica os resultados, enriquece os dados, classifica empresas com IA, persiste as informações em PostgreSQL e sincroniza os dados processados com o Google Sheets.

> 🚧 **Status: MVP funcional**

---

## Demonstração

### Interface

![Interface do LeadFlow](docs/screenshots/frontendscreen.png)

### Busca em execução

![Busca em execução](docs/screenshots/frontendloadingscreen.png)

### Busca concluída

![Busca concluída](docs/screenshots/frontendsearchsuccessscreen.png)

### Backfill concluído

![Backfill concluído](docs/screenshots/frontendbackfillsuccessscreen.png)

### Tratamento de erros

![Tratamento de erros](docs/screenshots/frontenderrorscreen.png)

---

## O que o LeadFlow faz?

O fluxo principal começa com dois parâmetros:

```text
Município + Segmento
```

A partir deles, o sistema:

1. Consulta a SerpAPI utilizando resultados locais.
2. Compara os resultados com empresas já armazenadas.
3. Remove empresas já conhecidas e duplicatas do próprio lote.
4. Normaliza os dados coletados.
5. Resolve e valida websites.
6. Persiste as novas empresas no PostgreSQL.
7. Classifica as empresas com IA.
8. Gera registros de `Lead` a partir das empresas qualificadas.
9. Persiste os leads no PostgreSQL.
10. Sincroniza os dados atuais do banco com o Google Sheets.

O sistema também possui um **Backfill**, responsável por reprocessar registros existentes e preencher ou atualizar dados que ficaram incompletos, como score, justificativa da IA e websites.

### PostgreSQL como fonte central

O PostgreSQL é a fonte central de persistência da aplicação. O Google Sheets não é mais utilizado como banco principal: ele funciona como uma camada de visualização e sincronização executada ao final das operações.

Isso permite manter a lógica de negócio independente da planilha e criar uma base mais adequada para consultas, relacionamentos e evolução futura da aplicação.

---

# Arquitetura

A aplicação está organizada em camadas para separar interface, API, regras de negócio, persistência e integrações externas.

```text
                         ┌──────────────────────┐
                         │      Frontend        │
                         │   React + Mantine    │
                         └──────────┬───────────┘
                                    │
                                  HTTP
                                    ▼
                         ┌──────────────────────┐
                         │       FastAPI        │
                         │       REST API       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    LeadFlow Core     │
                         │      Services        │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌────────────┐       ┌──────────────┐       ┌──────────────┐
       │  SerpAPI   │       │ DataProcessor│       │ Repositórios │
       │Google Local│       └──────┬───────┘       └──────┬───────┘
       └────────────┘              │                      │
                                   │                      │
                    ┌──────────────┼──────────────┐       │
                    │              │              │       │
                    ▼              ▼              ▼       ▼
            ┌───────────────┐ ┌──────────────┐ ┌──────────────┐
            |WebsiteResolver│ │CompanyScorer │ │ Deduplicação │
            |   🌐 Website  │ │     IA 🤖    │ │  & Backfill  │
            └───────────────┘ └──────────────┘ └──────────────┘
                                                    │
                                                    ▼
                                             ┌──────────────┐
                                             │  PostgreSQL  │
                                             │   Database   │
                                             └──────┬───────┘
                                                    │
                                                    ▼
                                             ┌──────────────┐
                                             │ Google Sheets│
                                             │  Sync final  │
                                             └──────────────┘
```

### Princípios da arquitetura

- **FastAPI** expõe a aplicação como API HTTP.
- **Services** orquestram os casos de uso.
- **DataProcessor** concentra transformação, deduplicação, enriquecimento e backfill.
- **Repositories** isolam o acesso aos mecanismos de persistência.
- **PostgreSQL** mantém os dados relacionais da aplicação.
- **Google Sheets** funciona como uma camada de sincronização/visualização.
- **SerpAPI** fornece os dados externos utilizados na coleta.
- **CompanyScorer** adiciona a classificação baseada em IA.
- **WebsiteResolver** resolve e normaliza o endereço do site das empresas, enriquecendo os dados coletados e também sendo utilizado durante o backfill.

---

## Fluxo de busca

```text
Usuário
   │
   │ Município + Segmento
   ▼
React
   │
   │ POST /companies
   ▼
FastAPI
   │
   ▼
LeadFlow Service
   │
   ▼
CompanyCollector
   │
   ▼
SerpAPI / Google Local
   │
   ▼
Dados brutos
   │
   ▼
DataProcessor
   │
   ├── Deduplicação
   ├── Normalização
   ├── Resolução de website
   └── Classificação com IA
   │
   ▼
Empresas processadas
   │
   ▼
CompanyRepository
   │
   ▼
PostgreSQL
   │
   ▼
Geração de Leads
   │
   ▼
LeadRepository
   │
   ▼
PostgreSQL
   │
   ▼
Google Sheets Sync
   │
   ├── Empresas
   └── Leads
```

A persistência ocorre no PostgreSQL durante a operação. Ao final, os dados atuais do banco são sincronizados com as abas correspondentes do Google Sheets.

---

## Fluxo de Backfill

O Backfill trabalha sobre os dados persistidos no PostgreSQL, e não sobre a planilha.

```text
Usuário
   │
   │ clique em Backfill
   ▼
React
   │
   │ POST /backfill
   ▼
FastAPI
   │
   ▼
LeadFlow Service
   │
   ▼
PostgreSQL
   │
   ├── Companies
   └── Leads
   │
   ▼
DataProcessor
   │
   ├── Reprocessamento de dados de empresas
   ├── Reavaliação com IA
   └── Resolução de websites
   │
   ▼
CompanyRepository / LeadRepository
   │
   ▼
PostgreSQL
   │
   ▼
Google Sheets Sync
   │
   ├── Empresas atualizadas
   └── Leads atualizados
```

O Backfill permite evoluir o conjunto de dados sem precisar executar novamente toda a etapa de coleta externa.

---

# Backend

O backend concentra a lógica de coleta, processamento, persistência e exposição da API.

## API

A API é construída com **FastAPI** e atualmente disponibiliza dois endpoints principais.

### `POST /companies`

Executa uma nova busca de empresas.

#### Request

```json
{
  "municipio": "Brasília",
  "setor": "Tecnologia"
}
```

#### Response

```json
{
  "status": "ok",
  "municipio": "Brasília",
  "setor": "Tecnologia",
  "brutos": 20,
  "salvos": 8
}
```

`brutos` representa o total de resultados retornados pela coleta.

`salvos` representa a quantidade de novas empresas persistidas após o processamento.

### `POST /backfill`

Reprocessa os dados existentes.

#### Response

```json
{
  "status": "ok",
  "empresas_atualizadas": 116,
  "leads_atualizados": 116
}
```

> Os valores acima são exemplos de resposta.

## Tratamento de erros

Erros encontrados durante a execução do pipeline são propagados pelo service até a camada da API.

O FastAPI converte as exceções em respostas HTTP estruturadas, permitindo que o frontend apresente a mensagem real do erro ao usuário.

Exemplo de resposta:

```json
{
  "detail": "Erro ao buscar empresas: ..."
}
```

No frontend, respostas HTTP fora da faixa de sucesso são interpretadas e exibidas no componente de feedback.

Esse fluxo evita esconder erros operacionais e facilita diagnóstico durante o uso da aplicação.

---

# Coleta de dados

A classe `CompanyCollector` é responsável pela comunicação com a SerpAPI.

Suas principais responsabilidades são:

- Construir a consulta.
- Considerar município e segmento.
- Excluir empresas já conhecidas da busca.
- Consultar a SerpAPI.
- Obter resultados locais.
- Retornar os dados brutos.

A coleta permanece separada do processamento para evitar o acoplamento direto entre o formato retornado pela fonte externa e os modelos internos da aplicação.

## SerpAPI

A SerpAPI foi escolhida como fonte principal do MVP.

O projeto utiliza o mecanismo:

```text
google_local
```

Os resultados podem fornecer:

- Nome da empresa.
- Telefone.
- Categoria/segmento.
- Website.
- Avaliação.
- Quantidade de avaliações.
- Endereço.
- Latitude.
- Longitude.
- Links relacionados.

### Por que SerpAPI?

- Retorno estruturado.
- Integração simples.
- Resultados locais.
- Busca por município e segmento.
- Permite evitar scraping direto da interface do Google Maps.

---

# Processamento dos dados

A classe `DataProcessor` atua como camada intermediária entre a coleta e os modelos utilizados pela aplicação.

Uma distinção importante do modelo atual é a separação entre **Company** e **Lead**.

### `Company`

Representa a empresa coletada e seus dados cadastrais/enriquecidos.

### `Lead`

Representa uma oportunidade derivada de uma empresa qualificada. O `Lead` referencia a empresa por `company_id` e armazena informações específicas da qualificação, como score e justificativa da IA.

O `DataProcessor` é responsável por:

- Extrair nomes existentes.
- Normalizar dados utilizados na comparação.
- Identificar duplicatas.
- Remover empresas já armazenadas.
- Remover duplicatas dentro do próprio lote.
- Construir objetos `Company`.
- Resolver websites.
- Classificar empresas com IA.
- Gerar objetos `Lead` a partir das empresas qualificadas.
- Realizar o processo de **Backfill**.

A lógica de processamento permanece independente da camada de armazenamento.

---

# Classificação com IA

O componente `CompanyScorer` avalia empresas e produz:

- `ia_score`
- `ia_justificativa`

Fluxo:

```text
Company
   │
   ▼
CompanyScorer 🤖
   │
   ▼
ScoreOutput
   │
   ├── ia_score
   └── justificativa
```

A classificação funciona como uma camada adicional de qualificação.

Depois da avaliação, empresas que atendem aos critérios definidos pelo sistema podem originar registros de `Lead`.

---

# Modelo de dados

O modelo atual separa os dados cadastrais da empresa dos dados específicos de lead.

## Company

Representa os dados principais da empresa:

- `id`
- `nome_empresa`
- `telefone`
- `segmento`
- `ia_score`
- `ia_justificativa`
- `site`
- `avaliacao`
- `quantidade_avaliacoes`
- `endereco`
- `latitude`
- `longitude`

## Lead

Representa uma oportunidade associada a uma empresa:

- `id`
- `company_id`
- `ia_score`
- `ia_justificativa`

A relação entre os modelos é:

```text
Company
   │
   │ 1 : 1
   ▼
Lead
```

A separação permite que uma empresa exista independentemente da sua classificação como lead e deixa o relacionamento explícito na base relacional.

---

# Armazenamento

A camada `src/backend/data_storage` concentra os componentes responsáveis pela persistência.

Estrutura atual:

```text
data_storage/
├── company_repository.py
├── lead_repository.py
├── database.py
├── schemas.sql
├── sheets.py
└── google_sheets_lead_repository.py
```

### PostgreSQL

O PostgreSQL é o armazenamento principal da aplicação.

Os repositories isolam operações de:

- **Create** — inserção de registros.
- **Read** — consulta dos registros.
- **Update** — atualização dos registros.

O esquema relacional atual possui, principalmente:

```text
  companies
      │
      │
      │
      ▼
    leads
```

A tabela `leads` possui uma chave estrangeira para `companies`.

### Google Sheets

O Google Sheets é utilizado como camada de sincronização e visualização.

Ao final das operações de busca e backfill, os dados atuais do PostgreSQL são lidos pelos repositories e enviados para as abas:

```text
LeadFlow
├── Empresas
└── Leads
```

Essa separação permite substituir ou complementar a camada de apresentação sem alterar as regras de negócio.

---

# Frontend

O frontend utiliza:

- **React**
- **Vite**
- **Mantine**

A interface atualmente permite:

- Informar município.
- Informar segmento/setor.
- Executar uma busca.
- Executar o Backfill.
- Exibir estado de carregamento.
- Bloquear novas interações durante operações em andamento.
- Exibir resultados de busca.
- Exibir resultados de Backfill.
- Exibir erros retornados pela API.

## Componentização

A interface foi dividida em componentes para manter o `App.jsx` focado na orquestração de estado e operações.

```text
src/frontend/src/
│
├── App.jsx
├── main.jsx
│
└── components/
    ├── LeadFlowHeader.jsx
    ├── SearchForm.jsx
    └── FeedbackAlert.jsx
```

### `LeadFlowHeader`

Responsável pela identidade visual do LeadFlow.

### `SearchForm`

Responsável pelos campos de município e setor e pelas ações de busca e Backfill.

### `FeedbackAlert`

Responsável pelo feedback visual das operações, diferenciando:

- Busca concluída.
- Backfill concluído.
- Erros retornados pela API.

---

# Fluxo de execução

## Busca

```text
Usuário
   │
   │ município + setor
   ▼
React
   │
   │ POST /companies
   ▼
FastAPI
   │
   ▼
LeadFlow Service
   │
   ▼
SerpAPI
   │
   ▼
DataProcessor
   │
   ├── Deduplicação
   ├── Normalização
   ├── Resolução de website
   └── Classificação com IA
   │
   ▼
PostgreSQL
   │
   ├── Companies
   └── Leads
   │
   ▼
Google Sheets
   │
   ▼
FastAPI
   │
   ▼
React
   │
   ▼
Feedback visual
```

## Backfill

```text
Usuário
   │
   │ clique em Backfill
   ▼
React
   │
   │ POST /backfill
   ▼
FastAPI
   │
   ▼
LeadFlow Service
   │
   ▼
PostgreSQL
   │
   ▼
DataProcessor
   │
   ├── Reprocessamento de empresas
   ├── Reavaliação de IA
   └── Resolução de websites
   │
   ▼
PostgreSQL
   │
   ▼
Google Sheets
   │
   ▼
FastAPI
   │
   ▼
React
   │
   ▼
Feedback visual
```

---

# Como usar

## Pré-requisitos

- Python 3.10+
- Node.js / npm
- Docker com Docker Compose
- Uma conta Google com acesso à planilha utilizada pelo projeto.
- Credenciais de uma Google Service Account.
- Chave da SerpAPI.
- Credenciais necessárias para o Gemini.

## 1. Clone o projeto

```bash
git clone <URL_DO_REPOSITORIO>
cd LeadFlow
```

## 2. Suba o PostgreSQL

O projeto utiliza Docker Compose para executar o banco PostgreSQL.

```bash
docker compose up -d
```

Verifique se o container do banco está em execução antes de iniciar o backend.

## 3. Configure o backend

O ambiente Python fica dentro de `src/backend`.

```bash
cd src/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Volte para a raiz do projeto antes de iniciar a API:

```bash
cd ../..
```

## 4. Configure as credenciais

Use `.env.example` como referência para criar o `.env` com as variáveis necessárias.

Crie também o arquivo de credenciais da Google Service Account a partir do exemplo:

```text
google-service-account-key.json.example
```

> **Nunca versione credenciais reais, chaves de API ou arquivos `.env`.**

## 5. Execute o backend

Na raiz do projeto:

```bash
uvicorn src.backend.main:app --reload
```

A API será disponibilizada em:

```text
http://127.0.0.1:8000
```

A documentação interativa do FastAPI:

```text
http://127.0.0.1:8000/docs
```

## 6. Execute o frontend

Em outro terminal:

```bash
cd src/frontend
npm install
npm run dev
```

O Vite informará no terminal o endereço local da aplicação.

## 7. Usando o LeadFlow

Na interface:

1. Informe o município.
2. Informe o segmento.
3. Clique em **Buscar leads**.

O sistema executará o pipeline e exibirá o resultado ao final da operação.

O botão **Backfill** executa o reprocessamento dos dados já armazenados.

Durante qualquer operação, a interface bloqueia novas interações para evitar execuções concorrentes.

---

# Configuração e arquivos de exemplo

Os arquivos de exemplo esperados pelo projeto são:

```text
.env.example
google-service-account-key.json.example
```

Esses arquivos servem apenas como referência para configuração local.

As credenciais reais devem permanecer fora do controle de versão.

---

# Tecnologias

## Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- SerpAPI
- PostgreSQL
- psycopg2
- Google Sheets API
- gspread
- Google Gemini
- python-dotenv
- pytest

## Frontend

- React
- Vite
- Mantine

## Infraestrutura

- Docker
- Docker Compose

---

# Comparação de métodos de extração

## Gemini Pro com Grounding × Google Places API

| Critério | Gemini Pro com Grounding | Google Places API |
| :--- | :--- | :--- |
| **Tipo de busca** | Consultas mais flexíveis e contextuais. | Buscas estruturadas por palavras-chave, categorias e localização. |
| **Volume de dados** | Adequado para listas menores e mais selecionadas. | Mais adequado para grandes volumes e paginação. |
| **Formato de saída** | Pode produzir Markdown, tabelas ou JSON. | Retorna dados estruturados para processamento. |
| **Velocidade** | Pode ser mais lento devido ao processamento do modelo. | Resposta direta da API. |

Durante o desenvolvimento, o Gemini com Grounding foi avaliado como alternativa de busca, mas a implementação atual utiliza a **SerpAPI** como principal fonte de coleta.

---

# Web Scraping

## Google Maps

O Google Maps apresenta desafios para automação direta:

- Conteúdo dinâmico.
- Dados que podem não estar disponíveis no HTML inicial.
- Mecanismos de proteção contra automação.
- Possíveis CAPTCHAs e bloqueios.
- Restrições associadas aos termos de uso da plataforma.

Ferramentas como Selenium podem automatizar um navegador, mas aumentam a complexidade e o custo computacional.

Por esse motivo, o MVP utiliza a **SerpAPI** em vez de realizar scraping direto do Google Maps.

---

# Estrutura do projeto

```text
LeadFlow/
│
├── src/
│   ├── backend/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── services/
│   │   │   └── leadflow_service.py
│   │   ├── data_collect/
│   │   ├── data_process/
│   │   ├── data_storage/
│   │   ├── tests/
│   │   └── requirements.txt
│   │
│   └── frontend/
│       ├── App.jsx
│       ├── main.jsx
│       ├── package.json
│       ├── package-lock.json
│       └── components/
│
├── .env.example
├── google-service-account-key.json.example
├── .gitignore
└── README.md
```

---

# Próximos passos

O MVP já cobre o fluxo principal de coleta, processamento, persistência, qualificação e sincronização. A partir daqui, as próximas melhorias podem ser escolhidas pelo ganho que trazem ao produto, sem exigir que toda a lista seja implementada para considerar o projeto concluído.

- [ ] Implementar página de listagem e consulta de empresas e leads.
- [ ] Criar tela de detalhes de uma empresa/lead.
- [ ] Implementar paginação para coletas maiores.
- [ ] Criar histórico das buscas realizadas.
- [ ] Avaliar outras fontes públicas de dados.
- [ ] Evoluir a sincronização com Google Sheets conforme o produto crescer.
- [ ] Evoluir a aplicação para PWA.

---

# Status

🚧 **MVP funcional**

O LeadFlow atualmente integra coleta de dados, processamento, classificação por IA, persistência relacional, API e interface web em um único fluxo operacional.

O MVP já consegue:

- Coletar empresas através da SerpAPI.
- Evitar empresas já existentes.
- Deduplicar resultados.
- Normalizar dados.
- Resolver e validar websites.
- Classificar empresas utilizando IA.
- Gerar leads a partir das empresas qualificadas.
- Persistir empresas e leads em PostgreSQL.
- Sincronizar os dados persistidos com o Google Sheets.
- Reprocessar registros existentes através do Backfill.
- Atualizar registros já armazenados.
- Expor o pipeline através de uma API FastAPI.
- Consumir a API através de uma interface React.
- Exibir estados de loading e feedback de sucesso/erro.
- Propagar erros da API até a interface do usuário.

O projeto segue em evolução, com foco em melhorar a exploração dos dados, ampliar o enriquecimento e transformar o MVP em uma ferramenta de prospecção mais completa.
