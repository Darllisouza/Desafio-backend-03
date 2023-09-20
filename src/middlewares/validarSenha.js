//verificar se o usuário tem ou não um token

const jwt = require("jsonwebtoken");

const validarToken = (request, response, next) => {
  try {
    const token = request.headers.validarToken; //pegar o token

    const decodedToken = jwt.verify(token, "SenhaParaGerarMeuToken"); //pegar as informações que estão dentro do token

    request.userData = { userId: decodedToken.userId }; //inserir uma informação que eu peguei do token na minha requisição

    next(); //terminei tudo que eu precisava fazer
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = validarToken;
