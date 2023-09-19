CREATE DATABASE dindin;

-- Cria a tabela "usuarios"
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    senha VARCHAR(255)
);


--Cria a tabela "categorias"
    CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255)
);

-- Cria a tabela "transacoes"
CREATE TABLE transacoes (
   id SERIAL PRIMARY KEY,
   descricao VARCHAR(255),
   valor NUMERIC(10, 2),
   data DATE,
   categoria_id INT,
   usuario_id INT,
   tipo VARCHAR(20),
   FOREIGN KEY (categoria_id) REFERENCES categorias (id),
   FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
);


