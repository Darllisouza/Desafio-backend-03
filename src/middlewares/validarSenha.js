//verificar se o usuário tem ou não um token

const jwt = require("jsonwebtoken");
const senhaJwt = require('../senhacriptografadajwt')

const validarToken = (request, response, next) => {
  try {
    const token = request.headers.authorization; //pegar o token

    const decodedToken = jwt.verify(token, senhaJwt); //pegar as informações que estão dentro do token

    request.userData = { id: decodedToken.id }; //inserir uma informação que eu peguei do token na minha requisição

    next(); //terminei tudo que eu precisava fazer
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = validarToken;
