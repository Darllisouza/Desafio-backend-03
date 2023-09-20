const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../database/conexao");

/*
const login = async (req, res) => {
	const { email, senha } = req.body
	
	try {
		const { rows, rowCount } = await pool.query(
			'select * from usuarios where email = $1', //testar no beekeeper antes
			[email]
		)
	
		if (rowCount === 0) {
			return res.status(400).json({ mensagem: 'Email ou senha inválida' }) //Não dizer onde está o erro deixa o código mais seguro
		}
	
		const { senha: senhaUsuario, ...usuario } = rows[0]
	
		const senhaCorreta = await bcrypt.compare(senha, senhaUsuario) //verificar a senha válida

	    //compara a senha que ta no banco com a senha do usuarios
		if (!senhaCorreta) {
			return res.status(400).json({ mensagem: 'Email ou senha incorreta' })
		}
	
		const token = jwt.sign({ id: usuario.id }, senhaJwt, { expiresIn: '1h' })
	
		return res.json({
			usuario,
			token,

		})
		
	} catch (error) {
		return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}
*/

const login = async (request, response) => {
  const { email, senha } = request.body;

  try {
    const usuario = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);

    if (usuario.rows.length === 0) {
      return response.status(401).send({ message: "Authentication failed" });
    }

    const senhaValida = await bcrypt.compare(
      senha,
      usuario.rows[0].senha
    );

    if (!senhaValida) {
      return response.status(401).send({ message: "Authentication failed" });
    }
   
    delete usuario.rows[0].senha;


    const token = jwt.sign(
      { usuarioId: usuario.rows[0].id },
      "SenhaParaGerarMeuToken",
      { expiresIn: "1h" }
    );


    return response.json({ 
      usuario: usuario.rows[0],
      token 
    });

  } catch (error) {
    console.error(error.message);
  }
}


module.exports = {
  login
}