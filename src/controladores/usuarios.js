const bcrypt = require('bcrypt')
const pool = require('../database/conexao')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhacriptografadajwt')

//Cadastro de um novo usuário
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

//login do usuário
const login = async (req, res) => {
	const { email, senha } = req.body
	
	try {
		const { rows, rowCount } = await pool.query(
			'select * from usuarios where email = $1', //testar no beekeeper antes
			[email]
		)
	
		if (rowCount === 0) {
			return res.status(401).json({ mensagem: 'Email ou senha inválida' }) //Não dizer onde está o erro deixa o código mais seguro
		}
	
		const { senha: senhaUsuario, ...usuario } = rows[0]
	
		const senhaCorreta = await bcrypt.compare(senha, senhaUsuario) //verificar a senha válida

	    //compara a senha que ta no banco com a senha do usuarios
		if (!senhaCorreta) {
			return res.status(401).json({ mensagem: 'Email ou senha incorreta' })
		}
	
		const token = jwt.sign({ id: usuario.id }, senhaJwt, { expiresIn: '10h' })

	
		return res.json({
			usuario,
			token,

		})
		
	} catch (error) {
		return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}


const detalharUsuario = async (req, res) => {
	const { id } = req.usuario;

	try {

	} catch (error) {
	  console.log(error.message);

	}
  };



module.exports =
{
 cadastrarUsuario,
 login,
 detalharUsuario
 
}