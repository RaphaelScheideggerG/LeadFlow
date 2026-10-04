export async function backfillCompanies() {
  const response = await fetch("/api/backfill", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await response.json();

      throw new Error(
        data.detail || "Erro ao realizar o backfill."
      );
    }

    throw new Error(
      `Servidor indisponível (HTTP ${response.status}).`
    );
  }

  return response.json();
}