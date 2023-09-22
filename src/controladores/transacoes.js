/*
todas as linhas estão comentadas. A ideia é que que isso facilite teu/nosso
entendimento linha por linha que eu fiz, tlgd? 
Só me lembra de apagar as explicações antes de mandar pra correção.

quando a gente for refatorar, acredito que essas validações ficam melhor em outro arquivo.
Deixei aqui pra n ficar maluca na hora de fazer kkk
*/

const pool = require('../database/conexao')

//rota montada, mas ta dando erro no servidor e o sono não me deixa verificar onde o erro ta
const cadastrarTransacao = async (req, res) => {

};


//rota listar transacações associadas a um usuario logado identificado pelo id - ok
const listarTransacoes = async (req, res) => {
    try {
        // Extrai o ID do usuário logado a partir do objeto req.usuario
        const { id } = req.usuario;
        
        // Extrai o parâmetro de consulta 'filtro' da requisição, se estiver presente
        const { filtro } = req.query;

        // Inicializa uma string de consulta SQL com um template
        const query = `
            SELECT t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id,
                c.id AS categoria_id, c.descricao AS categoria_nome
            FROM transacoes t
            LEFT JOIN categorias c ON c.id = t.categoria_id
            WHERE usuario_id = $1`;

        //array de parâmetros para a consulta SQL com o ID do usuário
        const params = [id];

        //Verifica se o parâmetro de consulta 'filtro' está presente. Se sim, adiciona uma cláusula na consulta SQL
        if (filtro) {
			//essa parte aqui, se tu não entender explico hj noite no meet
            //    para filtrar com base no 'filtro' usando ILIKE e incrementa os parâmetros
            query += ` AND c.descricao ILIKE $${params.length + 1}`;
            params.push(`%${filtro}%`);
        } 

        //Executa a consulta SQL no banco de dados usando os parâmetros
        const transacoes = await pool.query(query, params);

        //Retorna as transações encontradas no formato JSON
        return res.json(transacoes.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro no nosso servidor." });
    }
};

//rota detalhar transacao associadas a um usuario - ok
const detalharTransacao = async (req, res) => {
    //ID do usuário logado a partir do objeto 'req.usuario'.
    const userId = req.usuario.id;

    //ID da transação a partir dos parâmetros da rota.
    const transacaoId = req.params.id;

    try {
        //consulta SQL para obter detalhes da transação.
        const query = `
            SELECT t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id,
                c.id AS categoria_id, c.descricao AS categoria_nome
            FROM transacoes t
            LEFT JOIN categorias c ON t.categoria_id = c.id
            WHERE t.usuario_id = $1 AND t.id = $2`;

        // parâmetros para a consulta SQL, incluindo o ID do usuário e o ID da transação.
        const params = [userId, transacaoId];

        //Executa a consulta SQL no banco de dados e armazena o resultado em 'rows' e 'rowCount'.
        const { rows, rowCount } = await pool.query(query, params);

        //Verifica se a consulta não retornou nenhuma linha (transação não encontrada).
        if (rowCount === 0) {
            return res.status(404).json({ mensagem: "Transação não encontrada" });
        }

        //Retorna os detalhes da transação encontrada no formato JSON.
        return res.json(rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro no nosso servidor." });
    }
};


//rota atualizar transacao associadas a um usuario
const atualizarTransacao = (req, res) => {

};

//excluir atualizar transacao associadas a um usuario
const excluirTransacao = (req, res) => {

};

//rota obter extrato
const extratoTransacao = (req, res) => {

};



module.exports = 
{
  listarTransacoes,
  detalharTransacao,
  cadastrarTransacao,
  atualizarTransacao,
  excluirTransacao,
  extratoTransacao

}