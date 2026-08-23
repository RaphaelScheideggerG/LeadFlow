# LeadFlow

Pipeline de dados para prospecção de empresas e geração de leads, utilizando fontes externas para coleta, processamento e deduplicação dos dados, com armazenamento no Google Sheets.

## Arquitetura

O fluxo atual da aplicação é:

```text
Google Sheets
      │
      ├── Leads já existentes
      │         │
      │         ▼
      │   DataProcessor
      │         │
      │         ▼
      ├── Lista de exclusão
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
      └── Construção do modelo Lead
      │
      ▼
GoogleSheetsRepository
      │
      ▼
Google Sheets
```

## Comparação de métodos de extração de dados

### Gemini Pro com Grounding x Google Places API

| Critério             | Gemini Pro com Grounding                                                                                            | Google Places API                                                         |
| :------------------- | :------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------ |
| **Tipo de busca**    | Permite consultas mais flexíveis e contextuais, como "restaurantes bem avaliados que aceitam pets e possuem Wi-Fi". | Utiliza buscas estruturadas por palavras-chave, categorias e localização. |
| **Volume de dados**  | Melhor para pequenas listas selecionadas.                                                                           | Melhor para paginação e coleta de grandes volumes de estabelecimentos.    |
| **Formato de saída** | Pode estruturar a resposta em Markdown, tabelas ou JSON.                                                            | Retorna dados estruturados que precisam ser processados pela aplicação.   |
| **Velocidade**       | Pode ser mais lento devido ao processamento do modelo.                                                              | Resposta direta da API.                                                   |

### Fontes públicas gratuitas

Algumas fontes públicas podem ser utilizadas para complementar ou substituir serviços pagos.

* **Dados abertos da Receita Federal / CNPJ:** informações cadastrais de empresas, como nome, atividade econômica e município.
* **Prefeituras e câmaras de comércio:** alguns municípios disponibilizam registros de empresas licenciadas.
* **IBGE:** dados estatísticos por segmento, município e porte de empresa.
* **LinkedIn Sales Navigator:** pode auxiliar na prospecção B2B, sujeito aos limites e regras da plataforma.

#### Limitações

Essas fontes normalmente não possuem todos os dados necessários para um lead completo, como telefone, website ou avaliações. Por isso, podem exigir uma etapa adicional de enriquecimento dos dados.

## Web Scraping

### Google Maps

O Google Maps apresenta algumas dificuldades para coleta automatizada:

* Utiliza conteúdo dinâmico com JavaScript.
* Os dados podem não estar disponíveis diretamente no HTML inicial.
* Possui mecanismos de proteção contra automação.
* Pode apresentar CAPTCHAs e bloqueios.
* A coleta pode estar sujeita aos termos de uso da plataforma.

Ferramentas como Selenium podem automatizar um navegador, mas aumentam a complexidade e o custo computacional da coleta.

### Dados públicos + enriquecimento

Uma alternativa seria combinar diferentes fontes:

```text
Dados públicos de CNPJ
        ↓
Nome + segmento + município
        ↓
Enriquecimento dos dados
        ↓
Telefone + site + outras informações
```

Possíveis ferramentas:

* APIs ou bases públicas de CNPJ.
* Coleta de informações em diretórios públicos.
* Modelos de linguagem para validar, normalizar ou estruturar dados já obtidos.

A principal limitação é a possibilidade de informações desatualizadas ou incompletas.

## SerpAPI

Atualmente, a SerpAPI foi escolhida como fonte principal para o MVP.

### Vantagens

1. Possui plano gratuito com limite mensal de buscas.
2. Retorna os resultados em formato estruturado.
3. Permite obter resultados locais através do mecanismo `google_local`.
4. Simplifica a integração com resultados de mecanismos de busca.

Os resultados são posteriormente tratados pela aplicação antes de serem armazenados.

---

# Divisão de responsabilidades

## Coleta de dados

A classe `LeadCollector` é responsável por:

* Construir a consulta de busca.
* Enviar a consulta para a SerpAPI.
* Obter os resultados brutos.
* Retornar os dados para a camada de processamento.

A classe não é responsável por deduplicar ou transformar os dados no modelo final.

## Processamento dos dados

A classe `DataProcessor` atua como uma camada intermediária entre os dados brutos fornecidos pela API e o modelo utilizado pela aplicação.

Suas responsabilidades incluem:

* Extrair nomes de empresas existentes.
* Normalizar informações utilizadas para comparação.
* Identificar empresas duplicadas.
* Remover duplicatas presentes na planilha.
* Remover duplicatas presentes no próprio lote retornado pela API.
* Construir objetos `Lead` a partir dos dados brutos.

O objetivo é manter as regras de tratamento de dados separadas tanto da coleta quanto do armazenamento.

## Armazenamento

A classe `GoogleSheetsRepository` é responsável pela comunicação com o Google Sheets.

Atualmente, suas responsabilidades incluem:

* Ler os dados existentes na planilha.
* Salvar novos leads.
* Centralizar a lógica de acesso ao Google Sheets.

A implementação segue parcialmente a ideia do padrão Repository/DAO, isolando a lógica de persistência do restante da aplicação.

## Modelo de dados

O modelo `Lead` representa a estrutura padronizada utilizada pelo sistema.

Exemplo de informações armazenadas:

* Nome da empresa.
* Telefone.
* Segmento.
* Município.
* Estado.
* Website.
* Avaliação.
* Quantidade de avaliações.
* Endereço.
* Latitude.
* Longitude.

---

# Fluxo de execução

Atualmente, o programa executa aproximadamente o seguinte processo:

1. Conecta-se ao Google Sheets.
2. Obtém os leads já existentes.
3. Extrai os nomes existentes.
4. Utiliza esses nomes para evitar resultados já conhecidos durante a busca.
5. Coleta novos resultados através da SerpAPI.
6. Processa e deduplica os dados.
7. Constrói objetos `Lead`.
8. Salva apenas os novos leads na planilha.

```text
Leads existentes
      ↓
Lista de exclusão
      ↓
Busca
      ↓
Resultados brutos
      ↓
Processamento
      ↓
Deduplicação
      ↓
Lead
      ↓
Google Sheets
```

---

# Tecnologias

* Python
* SerpAPI
* Google Sheets API
* gspread
* Pydantic
* pytest
* python-dotenv

---

# Próximos passos

* [ ] Implementar análise dos leads coletados.
* [ ] Melhorar a busca por segmento e localização.
* [ ] Implementar enriquecimento de dados.
* [ ] Melhorar a cobertura de testes.
* [ ] Criar uma interface ou API para utilização do sistema.
* [ ] Avaliar outras fontes públicas de dados.
* [ ] Implementar paginação para coleta de maiores volumes de leads.
* [ ] Melhorar a identificação de município e estado a partir dos dados retornados.

## Status

🚧 **MVP funcional**

O LeadFlow atualmente consegue coletar empresas, evitar duplicatas, processar os resultados e armazenar novos leads automaticamente em uma planilha do Google Sheets.
