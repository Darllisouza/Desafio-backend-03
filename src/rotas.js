const express = require("express");
const validarToken = require("./middlewares/validarToken.js");

//importando endpoints usuario
const {
     cadastrarUsuario, 
     login, 
     detalharUsuario, 
     atualizarUsuario,
     listarCategorias 
} = require("./controladores/usuarios");

// importando endpoints transacoes
const { 
     listarTransacoes, 
     detalharTransacao, 
     cadastrarTransacao, 
     atualizarTransacao, 
     excluirTransacao, 
     extratoTransacao 
} = require("./controladores/transacoes.js");


const rotas = express();

//lista de rotas usuario
rotas.post("/usuario", cadastrarUsuario);  
rotas.post("/login", login);
rotas.get("/usuario",validarToken, detalharUsuario); 
rotas.put('/usuario',validarToken, atualizarUsuario); 

//rotas de categorias
rotas.get('/categoria',validarToken, listarCategorias );

//rotas de transacoes
rotas.get('/transacao', validarToken, listarTransacoes); //listar todas as suas transações cadastradas.
rotas.get('/transacao/:id', validarToken, detalharTransacao); //detalhar uma transação do usuário logado
rotas.post('/transacao', validarToken, cadastrarTransacao); //cadastrar uma transação associada ao usuário logado
rotas.put('/transacao/:id', validarToken, atualizarTransacao); //atualizar uma das suas transações cadastradas.
rotas.delete('/transacao/:id', validarToken,excluirTransacao);//excluir uma das suas transações cadastradas.
rotas.get('/transacao/extrato', validarToken, extratoTransacao); //obter o extrato de todas as suas transações cadastradas


module.exports = rotas;