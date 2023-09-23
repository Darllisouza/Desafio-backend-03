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
   tipo VARCHAR(20),
   descricao VARCHAR(255),
   valor NUMERIC(10, 2),
   data DATE,
   categoria_id INT,
   usuario_id INT,
   FOREIGN KEY (categoria_id) REFERENCES categorias (id),
   FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
);

--Inserção das categorias
INSERT INTO categorias (descricao) VALUES
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'), --01
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');