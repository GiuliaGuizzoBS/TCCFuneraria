const db = require('../config/db');

class Pedido {
  // 🔹 Cria um novo pedido
  static create(usuario_id, callback) {
    db.query(
      'INSERT INTO pedidos (usuario_id, status) VALUES (?, "aberto")',
      [usuario_id],
      (err, result) => {
        if (err) return callback(err, null);
        callback(null, { id: result.insertId, usuario_id, status: "aberto" });
      }
    );
  }

  // 🔹 Buscar pedido aberto do usuário
  static getPedidoAberto(usuario_id, callback) {
    db.query(
      'SELECT * FROM pedidos WHERE usuario_id = ? AND status = "aberto" LIMIT 1',
      [usuario_id],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results[0]);
      }
    );
  }

  // 🔹 Buscar produtos do pedido
  static getProdutos(pedido_id, callback) {
    const sql = `
      SELECT p.id, p.nome, p.descricao, p.preco, pp.quantidade
      FROM pedido_produtos pp
      JOIN produtos p ON pp.produto_id = p.id
      WHERE pp.pedido_id = ?
    `;
    db.query(sql, [pedido_id], callback);
  }

  // 🔹 Adicionar produto ao pedido
  static addProduto(pedido_id, produto_id, quantidade, callback) {
    const sql = `
      INSERT INTO pedido_produtos (pedido_id, produto_id, quantidade)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantidade = quantidade + VALUES(quantidade)
    `;
    db.query(sql, [pedido_id, produto_id, quantidade], callback);
  }

  // 🔹 Remover produto do pedido
  static removeProduto(pedido_id, produto_id, callback) {
    db.query(
      'DELETE FROM pedido_produtos WHERE pedido_id = ? AND produto_id = ?',
      [pedido_id, produto_id],
      callback
    );
  }

  // 🔹 Finalizar pedido
  static finalizar(pedido_id, callback) {
    db.query(
      'UPDATE pedidos SET status = "finalizado" WHERE id = ?',
      [pedido_id],
      callback
    );
  }

  // 🔹 Buscar produtos do pedido em aberto (para a tela principal)
  static getEmAberto(usuario_id, callback) {
    const sql = `
      SELECT p2.id, p2.nome, p2.descricao, p2.preco, pp.quantidade
      FROM pedidos pe
      JOIN pedido_produtos pp ON pe.id = pp.pedido_id
      JOIN produtos p2 ON pp.produto_id = p2.id
      WHERE pe.usuario_id = ? AND pe.status = 'aberto'
    `;
    db.query(sql, [usuario_id], callback);
  }

  // 🔹 Buscar pedidos confirmados com todos os detalhes
// 🔹 Buscar pedidos confirmados com todos os detalhes (sem duplicação)
static getConfirmados(callback) {
  const sql = `
    SELECT 
      pe.id AS pedido_id,
      pe.status,
      pe.criado_em,

      MAX(c.cliente) AS cliente,
      MAX(c.data) AS data,
      MAX(c.valor) AS valor,
      MAX(c.forma_de_pagamento) AS forma_de_pagamento,

      MAX(f.cremacao) AS cremacao,
      MAX(f.horario) AS horario,
      MAX(f.translado) AS translado,

      MAX(n.roupa) AS roupa,
      MAX(n.r_intimas) AS r_intimas,
      MAX(n.batom) AS batom,
      MAX(n.unha) AS unha,
      MAX(n.observacao) AS observacao,
      MAX(n.intensidade) AS intensidade,
      MAX(n.cabelo) AS cabelo,

      MAX(l.embacamento) AS embacamento,
      MAX(l.tanatopraxia) AS tanatopraxia,
      MAX(l.aspiracao) AS aspiracao,
      MAX(l.restauracao) AS restauracao,
      MAX(l.mumificacao) AS mumificacao,
      MAX(l.higienizacao) AS higienizacao,

      MAX(ca.cortina) AS cortina,
      MAX(ca.tapete) AS tapete,
      MAX(ca.livropre) AS livropre,
      MAX(ca.veleiro) AS veleiro,
      MAX(ca.cristo) AS cristo,
      MAX(ca.biblia) AS biblia,
      MAX(ca.cavalete) AS cavalete,

      MAX(e.numero) AS numero,
      MAX(e.rua) AS rua,
      MAX(e.bairro) AS bairro,
      MAX(e.cidade) AS cidade,
      MAX(e.estado) AS estado,
      MAX(e.pais) AS pais,

      MAX(fa.nome) AS falecido_nome,
      MAX(fa.idade) AS falecido_idade,
      MAX(fa.cpf) AS falecido_cpf,
      MAX(fa.rg) AS falecido_rg,
      MAX(fa.data_falecimento) AS falecido_data,
      MAX(fa.local_falecimento) AS falecido_local,
      MAX(fa.foto) AS falecido_foto,
      MAX(fa.comprovante_residencia) AS falecido_comprovante,

      -- produtos via subquery
      (SELECT GROUP_CONCAT(CONCAT(p2.nome, ' (', pp2.quantidade, ')') SEPARATOR ', ')
       FROM pedido_produtos pp2
       JOIN produtos p2 ON pp2.produto_id = p2.id
       WHERE pp2.pedido_id = pe.id) AS produtos,

      -- valor total via subquery
      (SELECT IFNULL(SUM(pp2.quantidade * p2.preco),0) + MAX(c.valor)
       FROM pedido_produtos pp2
       JOIN produtos p2 ON pp2.produto_id = p2.id
       WHERE pp2.pedido_id = pe.id) AS valor_total

    FROM pedidos pe
    LEFT JOIN contrata c ON c.pedido_id = pe.id
    LEFT JOIN formulario f ON f.usuario_id = pe.usuario_id
    LEFT JOIN necromaquiagem n ON n.id = f.necromaquiagem
    LEFT JOIN laboratorio l ON l.id = f.laboratorio
    LEFT JOIN cama_ardente ca ON ca.id = f.cama_ardente
    LEFT JOIN endereco e ON e.id = f.endereco_id
    LEFT JOIN falecido fa ON fa.id = f.falecido_id
    WHERE pe.status = 'finalizado'
    GROUP BY pe.id
    ORDER BY pe.criado_em DESC
  `;
  db.query(sql, callback);
}

// 🔹 Retorna todos os pedidos finalizados (admin) sem duplicação
static getTodos(callback) {
  return this.getConfirmados(callback); // podemos reutilizar o mesmo SQL, evita duplicação de código
}




  // 🔹 Buscar um pedido específico (usuário normal ou admin)
static getById(pedidoId, userRole, userId, callback) {
  const params = [pedidoId];
  let userFilter = '';

  if (userRole !== 'admin') {
    userFilter = 'AND pe.usuario_id = ?';
    params.push(userId);
  }

  const sql = `
    SELECT 
      pe.id AS pedido_id,
      pe.status,
      pe.criado_em,

      -- Dados do contrato
      c.cliente,
      c.data,
      c.valor,
      c.forma_de_pagamento,

      -- Dados do formulário
      f.cremacao,
      f.horario,
      f.translado,

      -- Necromaquiagem
      n.roupa,
      n.r_intimas,
      n.batom,
      n.unha,
      n.observacao,
      n.intensidade,
      n.cabelo,

      -- Laboratório
      l.embacamento,
      l.tanatopraxia,
      l.aspiracao,
      l.restauracao,
      l.mumificacao,
      l.higienizacao,

      -- Cama Ardente
      ca.cortina,
      ca.tapete,
      ca.livropre,
      ca.veleiro,
      ca.cristo,
      ca.biblia,
      ca.cavalete,

      -- Endereço
      e.numero,
      e.rua,
      e.bairro,
      e.cidade,
      e.estado,
      e.pais,

      -- Falecido
      fa.id AS falecido_id,
      fa.nome AS falecido_nome,
      fa.idade AS falecido_idade,
      fa.cpf AS falecido_cpf,
      fa.rg AS falecido_rg,
      fa.data_falecimento AS falecido_data,
      fa.local_falecimento AS falecido_local,
      fa.foto AS falecido_foto,
      fa.comprovante_residencia AS falecido_comprovante,

      -- Produtos concatenados
      (SELECT GROUP_CONCAT(CONCAT(p2.nome, ' (', pp2.quantidade, ')') SEPARATOR ', ')
       FROM pedido_produtos pp2
       JOIN produtos p2 ON pp2.produto_id = p2.id
       WHERE pp2.pedido_id = pe.id
      ) AS produtos,

      -- Valor total
      (SELECT IFNULL(SUM(pp2.quantidade * p2.preco),0) + IFNULL(c.valor,0)
       FROM pedido_produtos pp2
       JOIN produtos p2 ON pp2.produto_id = p2.id
       WHERE pp2.pedido_id = pe.id
      ) AS valor_total

    FROM pedidos pe
    LEFT JOIN contrata c ON c.pedido_id = pe.id
    LEFT JOIN formulario f ON f.usuario_id = pe.usuario_id
    LEFT JOIN necromaquiagem n ON n.id = f.necromaquiagem
    LEFT JOIN laboratorio l ON l.id = f.laboratorio
    LEFT JOIN cama_ardente ca ON ca.id = f.cama_ardente
    LEFT JOIN endereco e ON e.id = f.endereco_id
    LEFT JOIN falecido fa ON fa.id = f.falecido_id
    WHERE pe.id = ? ${userFilter};
  `;

  db.query(sql, params, (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, null);
    callback(null, results[0]);
  });
}





  // 🔹 Retorna todos os pedidos finalizados (admin) sem duplicação
// 🔹 Retorna todos os pedidos finalizados (admin) sem duplicação
static getTodos(callback) {
  // Reutiliza o mesmo SQL de getConfirmados para evitar duplicação de código
  this.getConfirmados(callback);
}



  // 🔹 Retorna detalhes de um pedido específico (admin) sem duplicação
// 🔹 Retorna detalhes de um pedido específico (admin) sem duplicação
static getByIdAdmin(pedidoId, callback) {
  const sql = `
    SELECT 
      pe.id AS pedido_id,
      pe.status,
      pe.criado_em,

      MAX(c.cliente) AS cliente,
      MAX(c.data) AS data,
      MAX(c.valor) AS valor,
      MAX(c.forma_de_pagamento) AS forma_de_pagamento,

      MAX(f.cremacao) AS cremacao,
      MAX(f.horario) AS horario,
      MAX(f.translado) AS translado,

      MAX(n.roupa) AS roupa,
      MAX(n.r_intimas) AS r_intimas,
      MAX(n.batom) AS batom,
      MAX(n.unha) AS unha,
      MAX(n.observacao) AS observacao,
      MAX(n.intensidade) AS intensidade,
      MAX(n.cabelo) AS cabelo,

      MAX(l.embacamento) AS embacamento,
      MAX(l.tanatopraxia) AS tanatopraxia,
      MAX(l.aspiracao) AS aspiracao,
      MAX(l.restauracao) AS restauracao,
      MAX(l.mumificacao) AS mumificacao,
      MAX(l.higienizacao) AS higienizacao,

      MAX(ca.cortina) AS cortina,
      MAX(ca.tapete) AS tapete,
      MAX(ca.livropre) AS livropre,
      MAX(ca.veleiro) AS veleiro,
      MAX(ca.cristo) AS cristo,
      MAX(ca.biblia) AS biblia,
      MAX(ca.cavalete) AS cavalete,

      MAX(e.numero) AS numero,
      MAX(e.rua) AS rua,
      MAX(e.bairro) AS bairro,
      MAX(e.cidade) AS cidade,
      MAX(e.estado) AS estado,
      MAX(e.pais) AS pais,

      MAX(fa.nome) AS falecido_nome,
      MAX(fa.idade) AS falecido_idade,
      MAX(fa.cpf) AS falecido_cpf,
      MAX(fa.rg) AS falecido_rg,
      MAX(fa.data_falecimento) AS falecido_data,
      MAX(fa.local_falecimento) AS falecido_local,
      MAX(fa.foto) AS falecido_foto,
      MAX(fa.comprovante_residencia) AS falecido_comprovante,
      MAX(c.numero_cliente) AS numero_cliente,
MAX(c.cpf_cliente) AS cpf_cliente,
MAX(c.rg_cliente) AS rg_cliente,


      -- produtos concatenados
      (SELECT GROUP_CONCAT(CONCAT(p2.nome, ' (', pp2.quantidade, ')') SEPARATOR ', ')
       FROM pedido_produtos pp2
       JOIN produtos p2 ON pp2.produto_id = p2.id
       WHERE pp2.pedido_id = pe.id) AS produtos,

      -- valor total
      (SELECT IFNULL(SUM(pp2.quantidade * p2.preco),0) + MAX(c.valor)
       FROM pedido_produtos pp2
       JOIN produtos p2 ON pp2.produto_id = p2.id
       WHERE pp2.pedido_id = pe.id) AS valor_total

    FROM pedidos pe
    LEFT JOIN contrata c ON c.pedido_id = pe.id
    LEFT JOIN formulario f ON f.usuario_id = pe.usuario_id
    LEFT JOIN necromaquiagem n ON n.id = f.necromaquiagem
    LEFT JOIN laboratorio l ON l.id = f.laboratorio
    LEFT JOIN cama_ardente ca ON ca.id = f.cama_ardente
    LEFT JOIN endereco e ON e.id = f.endereco_id
    LEFT JOIN falecido fa ON fa.id = f.falecido_id
    WHERE pe.id = ?
    GROUP BY pe.id
  `;
  db.query(sql, [pedidoId], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, null);
    callback(null, results[0]);
  });
}
}

module.exports = Pedido;
