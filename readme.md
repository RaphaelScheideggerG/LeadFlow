# LeadFlow

Pipeline de dados para prospecção de empresas e geração de leads.

O LeadFlow coleta empresas a partir de fontes externas, processa e deduplica os resultados, realiza enriquecimento e classificação com IA e armazena os leads gerados.

Atualmente, o sistema utiliza a **SerpAPI** como fonte de coleta, **Google Sheets** como camada de persistência e possui uma API desenvolvida com **FastAPI**, consumida por uma interface web em **React**.

> 🚧 **Status: MVP funcional**

---

## Arquitetura

A arquitetura atual está dividida em três partes principais:

```text
                    ┌─────────────────┐
                    │    Frontend     │
                    │ React + Mantine │
                    └────────┬────────┘
                             │
                             │ HTTP POST
                             ▼
                    ┌─────────────────┐
                    │     FastAPI     │
                    │   REST API      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   LeadFlow      │
                    │     Core        │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  ┌─────────────┐  ┌──────────────┐
        │ SerpAPI  │  │ DataProcessor│  │ Google Sheets│
        └──────────┘  └─────────────┘  └──────────────┘
                             │
                             ▼
                       ┌───────────┐
                       │ LeadScorer│
                       │    IA 🤖  │
                       └───────────┘
```

### Fluxo de dados

```text
Frontend
   │
   │ município + segmento
   ▼
FastAPI
   │
   ▼
LeadCollector
   │
   ▼
SerpAPI / Google Local Results
   │
   ▼
Dados brutos
   │
   ▼
DataProcessor
   │
   ├── Normalização
   ├── Deduplicação
   ├── Construção do modelo Lead
   ├── Validação/resolução de website
   └── Classificação com IA
          │
          ▼
      LeadScorer 🤖
          │
          ▼
    Lead enriquecido
          │
          ▼
GoogleSheetsRepository
          │
          ▼
Google Sheets
```

---

# Backend

O backend é responsável pela execução do pipeline de coleta, processamento e armazenamento dos leads.

## API

A aplicação utiliza **FastAPI** para disponibilizar uma API HTTP que pode ser consumida pelo frontend.

### Endpoint principal

```text
POST /leads
```

Recebe:

```json
{
  "municipio": "Brasília",
  "setor": "Tecnologia"
}
```

E retorna informações sobre a execução:

```json
{
  "status": "ok",
  "municipio": "Brasília",
  "setor": "Tecnologia",
  "brutos": 20,
  "salvos": 8
}
```

Onde:

- `brutos` representa a quantidade de resultados retornados pela busca;
- `salvos` representa a quantidade de novos leads processados e armazenados.

A API também possui configuração de **CORS** para permitir o acesso pelo frontend durante o desenvolvimento.

---

# Coleta de dados

A classe `LeadCollector` é responsável pela comunicação com a SerpAPI.

Suas responsabilidades incluem:

- Construir a consulta de busca.
- Considerar município e segmento.
- Excluir empresas já conhecidas da busca.
- Enviar a consulta para a SerpAPI.
- Obter os resultados do Google Local.
- Retornar os dados brutos para a camada de processamento.

A classe não é responsável pela transformação dos dados no modelo final.

## SerpAPI

Atualmente, a SerpAPI foi escolhida como principal fonte de dados do MVP.

O sistema utiliza resultados locais do Google através do mecanismo:

```text
google_local
```

Os resultados retornados podem conter informações como:

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

### Vantagens

1. Retorno estruturado.
2. Integração relativamente simples.
3. Resultados locais.
4. Permite realizar buscas por município e segmento.
5. Possui plano gratuito com limite mensal de buscas.

---

# Processamento dos dados

A classe `DataProcessor` atua como camada intermediária entre os dados brutos e o modelo `Lead`.

Suas responsabilidades incluem:

- Extrair nomes de empresas existentes na planilha.
- Normalizar informações utilizadas para comparação.
- Identificar empresas duplicadas.
- Remover empresas que já existem no armazenamento.
- Remover duplicatas dentro do próprio lote retornado pela API.
- Construir objetos `Lead`.
- Resolver e validar websites.
- Enriquecer leads com análise de IA.

O objetivo é manter as regras de tratamento dos dados separadas da coleta e do armazenamento.

---

# Classificação com IA

Após a construção do objeto `Lead`, o sistema pode submetê-lo ao `LeadScorer`.

O componente de IA produz informações relacionadas à qualidade/relevância do lead, incluindo:

- `ia_score`
- `ia_justificativa`

Exemplo conceitual:

```text
Lead
 │
 ▼
LeadScorer 🤖
 │
 ▼
ScoreOutput
 │
 ├── ia_score
 └── justificativa
```

O score é utilizado como uma camada adicional de filtragem e qualificação dos leads coletados.

---

# Modelo de dados

O modelo `Lead` representa a estrutura padronizada utilizada pelo sistema.

Atualmente, um lead pode conter:

- Nome da empresa.
- Telefone.
- Segmento.
- Município.
- Estado.
- Website.
- Avaliação.
- Quantidade de avaliações.
- Endereço.
- Latitude.
- Longitude.
- Score de IA.
- Justificativa da IA.

Exemplo da estrutura armazenada:

```text
┌─────────────────────────────┐
│ Empresa                     │
│ Telefone                    │
│ Segmento                    │
│ Município                   │
│ Estado                      │
│ Site                        │
│ Avaliação                   │
│ Qtd. avaliações             │
│ IA Score 🤖                 │
│ Justificativa 🧠            │
│ Endereço                    │
│ Latitude                    │
│ Longitude                   │
└─────────────────────────────┘
```

---

# Armazenamento

A classe `GoogleSheetsRepository` é responsável pela persistência dos leads.

Atualmente, suas responsabilidades incluem:

- Ler os dados existentes.
- Fornecer os dados necessários para deduplicação.
- Salvar novos leads.
- Centralizar a comunicação com o Google Sheets.

A implementação segue a ideia do padrão **Repository/DAO**, isolando a camada de persistência do restante da aplicação.

Atualmente:

```text
DataProcessor
      │
      ▼
GoogleSheetsRepository
      │
      ▼
Google Sheets
```

Uma futura migração para PostgreSQL poderá substituir essa camada sem exigir grandes alterações nas demais partes da aplicação.

---

# Frontend

O frontend foi desenvolvido utilizando:

- React
- Vite
- Mantine

A interface atualmente permite:

- Informar o município.
- Informar o segmento/setor.
- Executar uma busca.
- Exibir estado de carregamento.
- Desabilitar os campos durante a execução.
- Exibir o resultado da busca.
- Mostrar a quantidade de resultados brutos.
- Mostrar a quantidade de novos leads adicionados.

## Componentização

A interface foi dividida em componentes para evitar concentrar toda a lógica no `App.jsx`.

Estrutura atual:

```text
src/frontend/
│
├── App.jsx
├── main.jsx
│
└── components/
    ├── LeadFlowHeader.jsx
    ├── SearchForm.jsx
    └── SearchResult.jsx
```

### `LeadFlowHeader`

Responsável pela apresentação do nome da aplicação.

### `SearchForm`

Responsável pelos campos de entrada e ações de busca.

Recebe através de props:

- Município.
- Segmento.
- Estado de loading.
- Funções para atualização dos campos.
- Função de execução da busca.

### `SearchResult`

Responsável por apresentar o resultado da execução do pipeline.

Exibe:

- Quantidade de empresas encontradas na busca bruta.
- Quantidade de novos leads adicionados.

---

# Fluxo de execução

Atualmente, uma busca segue aproximadamente este fluxo:

```text
Usuário
   │
   │ Município + Setor
   ▼
React
   │
   │ POST /leads
   ▼
FastAPI
   │
   ▼
LeadCollector
   │
   ▼
SerpAPI
   │
   ▼
20 resultados brutos
   │
   ▼
DataProcessor
   │
   ├── Remove duplicatas
   ├── Remove empresas já existentes
   ├── Normaliza dados
   ├── Constrói Lead
   ├── Resolve website
   └── Classifica com IA
          │
          ▼
      Leads válidos
          │
          ▼
GoogleSheetsRepository
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
Resultado da busca
```

---

# Comparação de métodos de extração de dados

## Gemini Pro com Grounding x Google Places API

| Critério | Gemini Pro com Grounding | Google Places API |
| :--- | :--- | :--- |
| **Tipo de busca** | Permite consultas mais flexíveis e contextuais. | Utiliza buscas estruturadas por palavras-chave, categorias e localização. |
| **Volume de dados** | Melhor para pequenas listas selecionadas. | Melhor para paginação e coleta de grandes volumes de estabelecimentos. |
| **Formato de saída** | Pode estruturar a resposta em Markdown, tabelas ou JSON. | Retorna dados estruturados que precisam ser processados pela aplicação. |
| **Velocidade** | Pode ser mais lento devido ao processamento do modelo. | Resposta direta da API. |

Durante o desenvolvimento, o Gemini com Grounding foi avaliado como fonte de busca, mas a implementação atual utiliza a SerpAPI como principal fonte de coleta.

---

# Fontes públicas gratuitas

Algumas fontes públicas podem ser utilizadas futuramente para complementar ou substituir serviços externos.

- **Dados abertos da Receita Federal / CNPJ:** informações cadastrais de empresas, como nome, atividade econômica e município.
- **Prefeituras e câmaras de comércio:** alguns municípios disponibilizam registros de empresas licenciadas.
- **IBGE:** dados estatísticos por segmento, município e porte de empresa.
- **LinkedIn Sales Navigator:** pode auxiliar na prospecção B2B, sujeito aos limites e regras da plataforma.

### Limitações

Essas fontes normalmente não possuem todos os dados necessários para um lead completo, como telefone, website ou avaliações.

Por isso, podem exigir uma etapa adicional de enriquecimento.

---

# Web Scraping

## Google Maps

O Google Maps apresenta algumas dificuldades para coleta automatizada:

- Utiliza conteúdo dinâmico com JavaScript.
- Os dados podem não estar disponíveis diretamente no HTML inicial.
- Possui mecanismos de proteção contra automação.
- Pode apresentar CAPTCHAs e bloqueios.
- A coleta pode estar sujeita aos termos de uso da plataforma.

Ferramentas como Selenium podem automatizar um navegador, mas aumentam a complexidade e o custo computacional da coleta.

Por esse motivo, o MVP utiliza a SerpAPI em vez de realizar scraping direto do Google Maps.

---

# Estrutura do projeto

A estrutura atual está organizada aproximadamente da seguinte forma:

```text
LeadFlow/
│
├── src/
│   │
│   ├── backend/
│   │   ├── main.py
│   │   │
│   │   ├── models/
│   │   ├── data_collect/
│   │   ├── data_process/
│   │   └── data_storage/
│   │
│   └── frontend/
│       ├── App.jsx
│       ├── main.jsx
│       └── components/
│
├── tests/
│
├── .env
├── requirements.txt
└── README.md
```

---

# Tecnologias

## Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- SerpAPI
- Google Sheets API
- gspread
- python-dotenv
- Gemini
- pytest

## Frontend

- React
- Vite
- Mantine

---

# Próximos passos

- [ ] Melhorar a interface do frontend.
- [ ] Implementar página/listagem dos leads.
- [ ] Implementar funcionalidade de Backfill.
- [ ] Melhorar tratamento de erros no frontend.
- [ ] Adicionar feedback visual para falhas na API.
- [ ] Melhorar busca por segmento e localização.
- [ ] Melhorar identificação de município e estado.
- [ ] Implementar paginação para coleta de maiores volumes.
- [ ] Expandir cobertura de testes.
- [ ] Avaliar outras fontes públicas de dados.
- [ ] Avaliar migração do Google Sheets para PostgreSQL.
- [ ] Criar histórico das buscas realizadas.
- [ ] Implementar enriquecimento adicional dos leads.
- [ ] Refinar o sistema de classificação por IA.

---

# Status

🚧 **MVP funcional**

O LeadFlow atualmente consegue:

- Receber município e segmento através de uma interface web.
- Realizar buscas através da SerpAPI.
- Evitar empresas já existentes.
- Deduplicar resultados.
- Normalizar os dados coletados.
- Construir objetos `Lead`.
- Resolver e validar websites.
- Classificar leads utilizando IA.
- Armazenar novos leads automaticamente no Google Sheets.
- Expor o pipeline através de uma API FastAPI.
- Consumir a API através de uma interface React.
- Exibir feedback da execução para o usuário.

O projeto está em evolução e possui como próximos objetivos o aprimoramento da interface, enriquecimento dos dados, expansão do pipeline e futura migração da persistência para PostgreSQL.