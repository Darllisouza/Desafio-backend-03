const pool = require('../database/conexao')
const jwt = require("jsonwebtoken");
const senhaJwt = require('../senhacriptografadajwt')


//deve garantir que o usuario tenha realmente um token valido antes de logar no sistema
const validarToken = async (req, res, next) => {
	const { authorization } = req.headers

	if (!authorization) {
		return res.status(401).json({ mensagem: 'NPara acessar este recurso um token de autenticação válido deve ser enviado' })
       
 	}

  //extrai o token do header
  const token = authorization.split(' ')[1]

	try {    
		const { id } = jwt.verify(token, senhaJwt)//verificando e decodificando o token, 

    //procura no banco de dados o usuario com esse id
		const { rows, rowCount } = await pool.query(
			'select * from usuarios where id = $1',
			[id]
		)

		if (rowCount < 1) {
			return res.status(401).json({ mensagem: 'Não autorizado' })
		}

    //armazena as informações nesse objeto nomeado "req" para usar nas rotas
		req.usuario = rows[0]

		next()
    
	} catch (error) {
		return res.status(401).json({ mensagem: 'Não autorizado' })
	}
}


module.exports = validarToken;
