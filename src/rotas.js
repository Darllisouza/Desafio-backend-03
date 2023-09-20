const express = require("express");
const { cadastrarUsuario, login, detalharUsuario } = require("./controladores/usuarios");
const rotas = express();
const validarToken = require("./middlewares/validarSenha.js")

rotas.post("/usuario", cadastrarUsuario) //cadastrar um novo usuario no sistema.
rotas.post("/login", login) //realizar o login no sistema.


 //a partir daqui, é necessário exigir o token de autenticação do usuário logado
 
rotas.get("/usuario",validarToken, detalharUsuario, ) //obter os dados do seu próprio perfil.
rotas.put('/usuario',validarToken, ); //realizar alterações no seu próprio usuário.

rotas.get('/categoria',validarToken );//listar todas as categorias cadastradas.

rotas.get('/transacao', validarToken,); //listar todas as suas transações cadastradas.
rotas.get('/transacao/:id', validarToken,); //detalhar uma transação do usuário logado
rotas.post('/transacao', validarToken,); //cadastrar uma transação associada ao usuário logado
rotas.put('/transacao/:id', validarToken, ); //tualizar uma das suas transações cadastradas.
rotas.delete('/transacao/:id', validarToken,);//excluir uma das suas transações cadastradas.
rotas.get('/transacao/extrato', validarToken,); //obter o extrato de todas as suas transações cadastradas

module.exports = rotas;


