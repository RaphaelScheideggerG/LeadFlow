from src.backend.data_storage.database import obter_conexao
from src.backend.models.lead import Lead

class SQLiteLeadRepository:

    def list_all(self) -> list[Lead]:
        conexao = obter_conexao()
        cursor = conexao.cursor()
        
        cursor.execute("""
            SELECT nome_empresa, telefone, segmento, ia_score, ia_justificativa, 
                   site, avaliacao, quantidade_avaliacoes, endereco, latitude, longitude, linha 
            FROM leads
        """)
        rows = cursor.fetchall()
        conexao.close()

        leads = []
        for row in rows:
            leads.append(
                Lead(
                    nome_empresa=row[0],
                    telefone=row[1],
                    segmento=row[2],
                    ia_score=row[3],
                    ia_justificativa=row[4],
                    site=row[5],
                    avaliacao=row[6],
                    quantidade_avaliacoes=row[7],
                    endereco=row[8],
                    latitude=row[9],
                    longitude=row[10],
                    linha=row[11]
                )
            )
        return leads

    def save_leads(self, leads: list[Lead]) -> None:
        conexao = obter_conexao()
        cursor = conexao.cursor()
        
        # Prepara o comando de inserção em massa
        query = """
            INSERT INTO leads (nome_empresa, telefone, segmento, ia_score, ia_justificativa, 
                               site, avaliacao, quantidade_avaliacoes, endereco, latitude, longitude, linha)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        
        # Converte a lista de objetos para tuplas
        rows = [
            (
                lead.nome_empresa, lead.telefone, lead.segmento, lead.ia_score, lead.ia_justificativa,
                lead.site, lead.avaliacao, lead.quantidade_avaliacoes, lead.endereco, lead.latitude, lead.longitude, lead.linha
            )
            for lead in leads
        ]
        
        if rows:
            cursor.executemany(query, rows) # Executa em lote (muito mais rápido)
            conexao.commit()
            
        conexao.close()

    def update_leads(self, leads: list[Lead]) -> None:
        conexao = obter_conexao()
        cursor = conexao.cursor()
        
        # Atualiza baseado no nome da empresa ou na linha de controle
        query = """
            UPDATE leads SET 
                telefone = ?, segmento = ?, ia_score = ?, ia_justificativa = ?, 
                site = ?, avaliacao = ?, quantidade_avaliacoes = ?, endereco = ?, latitude = ?, longitude = ?
            WHERE nome_empresa = ?
        """
        
        rows = [
            (
                lead.telefone, lead.segmento, lead.ia_score, lead.ia_justificativa,
                lead.site, lead.avaliacao, lead.quantidade_avaliacoes, lead.endereco, lead.latitude, lead.longitude,
                lead.nome_empresa
            )
            for lead in leads
        ]
        
        if rows:
            cursor.executemany(query, rows)
            conexao.commit()
            
        conexao.close()
