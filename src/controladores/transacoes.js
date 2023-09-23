const pool = require('../database/conexao')

//rota cadastrar transacao e associar a um usuario - ok
const cadastrarTransacao = async (req, res) => {
	
    const { tipo, descricao, valor, data, categoria_id} = req.body;
	const usuario_id = req.usuario.id;


	try{
        //procurar categoria na base de dados
		const categoriaInformada = await pool.query('select * from categorias where id= $1',
	        [categoria_id])

		if (categoriaInformada.rowCount === 0){
			return res.status(400).json({ mensagem: "Categoria não existe." });

		}
        //inserir na tabela de transacoes
		const query = await pool.query (
		    `insert into transacoes (tipo, descricao, valor, data, categoria_id, usuario_id)
		    values ($1, $2, $3, $4, $5, $6 ) returning * `,
			[tipo, descricao, valor, data, categoria_id, usuario_id]
	        
		);

		const usuarioTransacao = query.rows[0];

	     return res.status(201).json(usuarioTransacao)

	}catch(error){
         return res.status(500).json({ mensagem: "Erro interno no servidor."})
	}
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


//rota atualizar transacao associadas a um usuario - ok
const atualizarTransacao = async (req, res) => {
	const {id} = req.params; //recebendo id da transacao no parametro da rota
    const { tipo, descricao, valor, data, categoria_id} = req.body;//dados passados na requisicao
	const usuario_id = req.usuario.id;//id do usuario já logado

	try {
        //consultar se essa transacao existe no banco de dados
		const transacaoExiste = await pool.query(
			'select * from transacoes where id = $1 and usuario_id = $2',
			[id, usuario_id]
		)

		if(transacaoExiste.rows.length === 0){
			return res.status(404).json({ mensagem: "transacao nao encontrada."})
		}

		//se existir, será atualizada na mesma ordem
		const query = await pool.query(
			'update transacoes set tipo = $1, descricao = $2, valor = $3, data = $4, categoria_id = $5 where id = $6 and usuario_id = $7 returning *',
			[tipo, descricao, valor, data, categoria_id, id, usuario_id]
		)

		const transacaoUpdate = query.rows[0];
		return res.status(201).json(transacaoUpdate)

	}catch(error){
        return res.status(500).json({ mensagem: "Erro no nosso servidor." });

	}

};

//excluir atualizar transacao associadas a um usuario - ok
const excluirTransacao = async (req, res) => {
    const userId = req.usuario.id;
    const transacaoId = req.params.id;
    try {
        const query = `
        DELETE FROM transacoes 
        WHERE id = $1 
        AND usuario_id = $2`;

        const params = [transacaoId , userId ];
        const result = await pool.query(query, params);

        // Verifica se nenhum registro foi afetado pela consulta.
        if (result.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Transação não encontrada.' });
        }
        return res.status(204).json();
    } catch (error) {

        console.error('Erro interno do servidor:', error);
        return res.status(500).json({ mensagem: 'Erro no nosso servidor.' });
    }
};

//rota obter extrato - ok
const extratoTransacao = async (req, res) => {
    // Extrai o ID do usuário do objeto req.usuario
    const { id } = req.usuario;

    try {
        // Consulta SQL para calcular a soma das transações de entrada e saída
        const query = `
            SELECT
                COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END), 0) AS entrada,
                COALESCE(SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END), 0) AS saida
            FROM transacoes
            WHERE usuario_id = $1
        `;

        // Parâmetros para a consulta SQL, incluindo o ID do usuário
        const params = [id];

        // Executa a consulta SQL usando o pool de conexões do banco de dados
        const { rows } = await pool.query(query, params);

        // Extrai os valores do resultado da consulta para criar o objeto de extrato
        const extrato = {
            entrada: Number(rows[0].entrada), // Soma das transações de entrada
            saida: Number(rows[0].saida),     // Soma das transações de saída
        };

        return res.status(200).json(extrato);
        
    } catch (error) {
        return res.status(500).json({ mensagem: '"Erro no nosso servidor."' });
    }
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