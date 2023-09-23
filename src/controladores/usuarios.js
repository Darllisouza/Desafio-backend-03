const bcrypt = require('bcrypt')
const pool = require('../database/conexao')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhacriptografadajwt')

//Cadastro de um novo usuário - ok
//obs: verificar status code
const cadastrarUsuario = async (req, res) => {
	const { nome, email, senha } = req.body

	if (!nome || !email || !senha) {
		return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" }); 
	}

	try {
		const emailExiste = await pool.query('select * from usuarios where email = $1',[email])

		if (emailExiste.rowCount > 0) {
			return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado!' })
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

//login do usuário - ok
//verificar status code
const login = async (req, res) => {
	const { email, senha } = req.body

	if (!email || !senha) {
		return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" }); 
	}
	
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

//rota de exibir informações do usuario através do seu token
const detalharUsuario = async (req, res) => {
	return res.json(req.usuario)
}


//rota de atualizar informacoes do usuario - ok
//obs: verificar status code
const atualizarUsuario = async (req, res) => {
	const { nome, email, senha} = req.body

	if (!nome || !email || !senha) {
		return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
	}

	try {
      
		//validar se existe outro usuario com esse email
		if( email !== req.usuario.email){
			const { rowCount } = await pool.query(
				'select id from usuarios where email = $1',
				[email]
			);

			//nao permitir que use o email de outro usuario, porem esta permitindo que subscreva em cima do proprio email
			if (rowCount > 0) {
				return res.status(404).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.'});
			}
		}

        //se usuario alterar a senha, criptografar novamente
		let senhaHash = req.usuario.senha
		if(senha){
			senhaHash = await bcrypt.hash(senha, 10)
		}

       //esta parte atualiza informações do usuario nessa ordem de acordo com o banco de dados
		await pool.query(
			'update usuarios set nome = $2, email = $3, senha = $4 where id = $1',
			[req.usuario.id, nome, email, senhaHash]
		);

		return res.status(200).json({ mensagem: "usuario atualizado!"})

	} catch (error) {
		return res.status(500).json('Erro interno do servidor')
	}
}


//lista categorias cadastradas no banco de dados - ok
const listarCategorias = async (req, res) => {
	try {
		const { rows } = await pool.query('select * from categorias')

		return res.json(rows)
	} catch (error) {
		return res.status(500).json('Erro interno do servidor')
	}
}


module.exports =
{
 cadastrarUsuario,
 login,
 detalharUsuario,
 atualizarUsuario,
 listarCategorias
}