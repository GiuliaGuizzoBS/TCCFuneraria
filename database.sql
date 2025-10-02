CREATE DATABASE IF NOT EXISTS CRUD;
USE CRUD;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL
);

CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    quantidade INT NOT NULL,
    categoria INT NOT NULL,
    FOREIGN KEY (categoria) REFERENCES categorias(id)
);

CREATE TABLE IF NOT EXISTS imagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    categoria INT NOT NULL,
    FOREIGN KEY (categoria) REFERENCES categorias(id)
);

CREATE TABLE IF NOT EXISTS cama_ardente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cortina BOOLEAN,
    tapete BOOLEAN,
    livropre BOOLEAN,
    veleiro BOOLEAN,
    cristo BOOLEAN,
    biblia BOOLEAN,
    cavalete BOOLEAN
);

CREATE TABLE IF NOT EXISTS necromaquiagem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roupa VARCHAR(100),
    r_intimas BOOLEAN,
    batom VARCHAR(10),
    unha VARCHAR(20),
    observacao VARCHAR(100),
    intensidade BOOLEAN,
    cabelo INT
);

CREATE TABLE IF NOT EXISTS laboratorio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    embacamento BOOLEAN,
    tanatopraxia BOOLEAN,
    aspiracao BOOLEAN,
    restauracao BOOLEAN,
    mumificacao BOOLEAN,
    higienizacao BOOLEAN
);

CREATE TABLE IF NOT EXISTS endereco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero INT,
    rua VARCHAR(40),
    bairro VARCHAR(15),
    cidade VARCHAR(15),
    estado VARCHAR(20),
    pais VARCHAR(15)
);

CREATE TABLE IF NOT EXISTS forma_de_pagamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS formulario (
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

CREATE TABLE IF NOT EXISTS contrata (
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

CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  status VARCHAR(20) DEFAULT 'aberto',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pedido_produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT DEFAULT 1,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);
