CREATE DATABASE IF NOT EXISTS CRUD;
USE CRUD;

-- Tabela 'users'
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL
);

-- Tabela 'pedidos'
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'aberto',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users(id)
);

-- Tabela 'produtos'
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    quantidade INT NOT NULL,
    categoria ENUM('funerais', 'flores', 'homenagens') NOT NULL
);

-- Tabela 'imagens'
CREATE TABLE IF NOT EXISTS imagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    produto_id INT NOT NULL,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Tabela 'cama_ardente'
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

-- Tabela 'necromaquiagem'
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

-- Tabela 'laboratorio'
CREATE TABLE IF NOT EXISTS laboratorio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    embacamento BOOLEAN,
    tanatopraxia BOOLEAN,
    aspiracao BOOLEAN,
    restauracao BOOLEAN,
    mumificacao BOOLEAN,
    higienizacao BOOLEAN
);

-- Tabela 'endereco'
CREATE TABLE IF NOT EXISTS endereco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero INT NOT NULL,
    rua VARCHAR(40) NOT NULL,
    bairro VARCHAR(15) NOT NULL,
    cidade VARCHAR(15) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    pais VARCHAR(15) NOT NULL
);

-- Tabela 'formulario' agora RELACIONA com pedido_id e usuario_id
CREATE TABLE IF NOT EXISTS formulario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    usuario_id INT NOT NULL,  -- Nova coluna adicionada
    cremacao BOOLEAN,
    horario INT,
    translado VARCHAR(100),
    necromaquiagem INT,
    laboratorio INT,
    cama_ardente INT,
    endereco_id INT,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE, -- Nova chave estrangeira com CASCADE
    FOREIGN KEY (necromaquiagem) REFERENCES necromaquiagem(id),
    FOREIGN KEY (laboratorio) REFERENCES laboratorio(id),
    FOREIGN KEY (cama_ardente) REFERENCES cama_ardente(id),
    FOREIGN KEY (endereco_id) REFERENCES endereco(id)
);

-- Tabela 'pedido_produtos'
CREATE TABLE IF NOT EXISTS pedido_produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT DEFAULT 1,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Tabela 'contrata' agora NÃO precisa de formulario_id
CREATE TABLE IF NOT EXISTS contrata (
    id INT AUTO_INCREMENT PRIMARY KEY,
    valor DECIMAL(10,2) NOT NULL,
    hora INT,
    data DATE NOT NULL,
    assinatura INT NOT NULL,
    forma_de_pagamento VARCHAR(50),
    cliente VARCHAR(255) NOT NULL,
    pedido_id INT,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);
