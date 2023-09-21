const bcrypt = require('bcrypt')
const pool = require('../database/conexao')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhacriptografadajwt')


//rota listar transacações associadas a um usuario
const listarTransacao = (req, res) => {

};

//rota detalhar transacao associadas a um usuario
const detalharTransacao = (req, res) => {

};

//rota para usuario logado cadastrar uma transacao - esta incompleta e nao funciona kkkk
const cadastrarTransacao = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body;

	try {
		const { rows } = await pool.query(
			'insert into categorias (id, categoria_id, tipo) values ($1, $2, $3, $4, $5) returning *',
			[modelo, marca, ano, cor, descricao]
		)

		return res.status(201).json(rows[0])
	} catch (error) {
		return res.status(500).json('Erro interno do servidor')
	}
}

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
  listarTransacao,
  detalharTransacao,
  cadastrarTransacao,
  atualizarTransacao,
  excluirTransacao,
  extratoTransacao

}