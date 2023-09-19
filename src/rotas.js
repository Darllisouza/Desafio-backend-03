const express = require("express");
const { cadastrarUsuario, login, detalharUsuario } = require("./controladores/usuarios");
const rotas = express();

rotas.post("/usuario", cadastrarUsuario)
rotas.post("/login", login)
rotas.get("/usuario", detalharUsuario)
module.exports = rotas