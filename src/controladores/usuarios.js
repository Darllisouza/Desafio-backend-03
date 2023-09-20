const bcrypt = require('bcrypt')
const pool = require('../database/conexao')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhacriptografadajwt')


const cadastrarUsuario = async (req, res) => {
	const { nome, email, senha } = req.body

	try {
		const emailExiste = await pool.query('select * from usuarios where email = $1',[email])

		if (emailExiste.rowCount > 0) {
			return res.status(400).json({ mensagem: 'Email já existe!' })
		}

		const senhaCriptografada = await bcrypt.hash(senha, 10)

		const query = `
			insert into usuarios (nome, email, senha)
			values ($1, $2, $3) returning *
		`

		const { rows } = await pool.query(query, [nome, email, senhaCriptografada])

		const { senha: _, ...usuario } = rows[0]

		return res.status(201).json(usuario)
	} catch (error) {
		return res.status(500).json({ mensagem: 'Erro interno do servidor' })
	}

}


/*
const detalharUsuario = async (req, res) => {
	try {
		const queryBanco = 'select * from usuarios where email = $1';
		const { rows, rowCount } = await pool.query(queryBanco, [tokenExiste]);

        if (rowCount === 0) {
			return res.status(400).json({ mensagem: 'Usuario nao encontrado!'})
		}

		const usuarioEncontrado = rows[0];
		return res.status(200).json(usuarioEncontrado);

	} catch (error){
		return res.status(400).json({ mensagem: 'Token inválido!'})
	}
}
*/


module.exports =
{
 cadastrarUsuario
 
}