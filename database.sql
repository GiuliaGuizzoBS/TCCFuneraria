CREATE DATABASE CRUD;

USE CRUD;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL
);

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

//crie a tabela produtos com os campos id, nome, descricao e preco
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    quantidade INT NOT NULL,
    categoria INT NOT NULL,
    FOREIGN KEY (categoria) REFERENCES categorias(id)
);

CREATE TABLE imagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
   url VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    categoria INT NOT NULL,
    FOREIGN KEY (categoria) REFERENCES categorias(id)
);

use crud;

-- MIGA LIA AS QUE EU COLOQUEI TÃO AQUI BJ LINDA



CREATE TABLE cama_ardente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cortina BOOLEAN,
    tapete BOOLEAN,
    livropre BOOLEAN,
    veleiro BOOLEAN,
    cristo BOOLEAN,
    biblia BOOLEAN,
    cavalete BOOLEAN
);


CREATE TABLE necromaquiagem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roupa VARCHAR(100),
    r_intimas BOOLEAN,
    batom VARCHAR(10),
    unha VARCHAR(20),
    observacao VARCHAR(100),
    intensidade BOOLEAN,
    cabelo INT
);


CREATE TABLE laboratorio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    embacamento BOOLEAN,
    tanatopraxia BOOLEAN,
    aspiracao BOOLEAN,
    restauracao BOOLEAN,
    mumificacao BOOLEAN,
    higienizacao BOOLEAN
);

CREATE TABLE endereco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero INT,
    rua VARCHAR(40),
    bairro VARCHAR(15),
    cidade VARCHAR(15),
    estado VARCHAR(20),
    pais VARCHAR(15)
);


CREATE TABLE forma_de_pagamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(10)
);


CREATE TABLE formulario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cremacao BOOLEAN,
    horario INT,
    translado VARCHAR(100),
    necromaquiagem INT,
    laboratorio INT,
    cama_ardente INT,
    FOREIGN KEY (necromaquiagem) REFERENCES necromaquiagem(id),
    FOREIGN KEY (laboratorio) REFERENCES laboratorio(id),
    FOREIGN KEY (cama_ardente) REFERENCES cama_ardente(id)
);


CREATE TABLE contrata (
    id INT AUTO_INCREMENT PRIMARY KEY,
    valor DECIMAL(10,2),
    hora INT,
    data DATE,
    assinatura INT,
    forma_de_pagamento INT,
    cliente INT,
    FOREIGN KEY (forma_de_pagamento) REFERENCES forma_de_pagamento(id),
    FOREIGN KEY (cliente) REFERENCES users(id)
);
