const express = require('express');//importando o frame express;
const rotas = require('./rotas'); //importando arquivo das rotas;

const app = express(); //invocando express;
const porta = 8000;

app.use(express.json());//definir o json como padrao;
app.use(rotas); 



app.listen(porta, () => {
    console.log(`Servidor está rodando em: https://localhost:${porta}`);

});