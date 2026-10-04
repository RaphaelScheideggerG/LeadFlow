export async function searchCompanies({ municipio, setor }) {
  const response = await fetch('/api/search-companies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ municipio, setor }),
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await response.json();

      throw new Error(
        data.detail || 'Erro ao realizar a busca.'
      );
    }

    throw new Error(
      `Servidor indisponível (HTTP ${response.status}).`
    );
  }

  return response.json();
}