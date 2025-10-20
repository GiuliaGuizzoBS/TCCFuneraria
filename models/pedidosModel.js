const db = require('../config/db');

class Pedido {
  // Cria um novo pedido
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

  // Buscar pedido aberto do usuário
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

  // Buscar produtos do pedido
  static getProdutos(pedido_id, callback) {
    const sql = `
      SELECT p.id, p.nome, p.descricao, p.preco, pp.quantidade
      FROM pedido_produtos pp
      JOIN produtos p ON pp.produto_id = p.id
      WHERE pp.pedido_id = ?
    `;
    db.query(sql, [pedido_id], callback);
  }

  // Adicionar produto ao pedido
  static addProduto(pedido_id, produto_id, quantidade, callback) {
    const sql = `
      INSERT INTO pedido_produtos (pedido_id, produto_id, quantidade)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantidade = quantidade + VALUES(quantidade)
    `;
    db.query(sql, [pedido_id, produto_id, quantidade], callback);
  }

  // Remover produto do pedido
  static removeProduto(pedido_id, produto_id, callback) {
    db.query(
      'DELETE FROM pedido_produtos WHERE pedido_id = ? AND produto_id = ?',
      [pedido_id, produto_id],
      callback
    );
  }

  // Finalizar pedido
  static finalizar(pedido_id, callback) {
    db.query(
      'UPDATE pedidos SET status = "finalizado" WHERE id = ?',
      [pedido_id],
      callback
    );
  }

    // Buscar produtos do pedido em aberto (para a tela principal)
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
// Buscar pedidos confirmados com todos os detalhes e produtos
static getConfirmados(usuario_id, callback) {
  const sql = `
    SELECT 
      pe.id AS pedido_id,
      pe.status,
      pe.criado_em,
      c.cliente,
      c.data,
      c.valor,
      c.forma_de_pagamento,

      f.cremacao,
      f.horario,
      f.translado,

      n.roupa,
      n.r_intimas,
      n.batom,
      n.unha,
      n.observacao,
      n.intensidade,
      n.cabelo,

      l.embacamento,
      l.tanatopraxia,
      l.aspiracao,
      l.restauracao,
      l.mumificacao,
      l.higienizacao,

      ca.cortina,
      ca.tapete,
      ca.livropre,
      ca.veleiro,
      ca.cristo,
      ca.biblia,
      ca.cavalete,

      e.numero,
      e.rua,
      e.bairro,
      e.cidade,
      e.estado,
      e.pais,

      GROUP_CONCAT(DISTINCT CONCAT(p.nome, ' (', pp.quantidade, ')') SEPARATOR ', ') AS produtos
    FROM pedidos pe
    LEFT JOIN contrata c ON c.pedido_id = pe.id
    LEFT JOIN formulario f ON f.usuario_id = pe.usuario_id
    LEFT JOIN necromaquiagem n ON n.id = f.necromaquiagem
    LEFT JOIN laboratorio l ON l.id = f.laboratorio
    LEFT JOIN cama_ardente ca ON ca.id = f.cama_ardente
    LEFT JOIN endereco e ON e.id = f.endereco_id
    LEFT JOIN pedido_produtos pp ON pp.pedido_id = pe.id
    LEFT JOIN produtos p ON p.id = pp.produto_id
    WHERE pe.usuario_id = ? AND pe.status = 'finalizado'
    GROUP BY 
      pe.id, pe.status, pe.criado_em, 
      c.cliente, c.data, c.valor, c.forma_de_pagamento,
      f.cremacao, f.horario, f.translado,
      n.roupa, n.r_intimas, n.batom, n.unha, n.observacao, n.intensidade, n.cabelo,
      l.embacamento, l.tanatopraxia, l.aspiracao, l.restauracao, l.mumificacao, l.higienizacao,
      ca.cortina, ca.tapete, ca.livropre, ca.veleiro, ca.cristo, ca.biblia, ca.cavalete,
      e.numero, e.rua, e.bairro, e.cidade, e.estado, e.pais
    ORDER BY pe.criado_em DESC
  `;
  
  db.query(sql, [usuario_id], callback);
}


  // 🔹 Atualizar status do pedido
  static atualizarStatus(pedido_id, status, callback) {
    db.query(
      'UPDATE pedidos SET status = ? WHERE id = ?',
      [status, pedido_id],
      callback
    );
  }
}

Pedido.getById = (pedidoId, userId, callback) => {
  const sql = `
    SELECT 
      pe.id AS pedido_id,
      pe.status,
      pe.criado_em,
      
      c.cliente,
      c.data AS contrato_data,
      c.valor,
      c.forma_de_pagamento,
      
      f.cremacao,
      f.horario,
      f.translado,
      
      n.roupa,
      n.r_intimas,
      n.batom,
      n.unha,
      n.observacao,
      n.intensidade,
      n.cabelo,
      
      l.embacamento,
      l.tanatopraxia,
      l.aspiracao,
      l.restauracao,
      l.mumificacao,
      l.higienizacao,
      
      ca.cortina,
      ca.tapete,
      ca.livropre,
      ca.veleiro,
      ca.cristo,
      ca.biblia,
      ca.cavalete,
      
      e.numero,
      e.rua,
      e.bairro,
      e.cidade,
      e.estado,
      e.pais,
      
      fal.nome AS falecido_nome,
      fal.idade AS falecido_idade,
      fal.cpf AS falecido_cpf,
      fal.rg AS falecido_rg,
      fal.data_falecimento AS falecido_data_falecimento,
      fal.local_falecimento AS falecido_local_falecimento,
      fal.foto AS falecido_foto,
      fal.comprovante_residencia AS falecido_comprovante,

      GROUP_CONCAT(DISTINCT CONCAT(p.nome, ' (', pp.quantidade, ')') SEPARATOR ', ') AS produtos

    FROM pedidos pe
    LEFT JOIN contrata c ON c.pedido_id = pe.id
    LEFT JOIN formulario f ON f.usuario_id = pe.usuario_id
    LEFT JOIN necromaquiagem n ON n.id = f.necromaquiagem
    LEFT JOIN laboratorio l ON l.id = f.laboratorio
    LEFT JOIN cama_ardente ca ON ca.id = f.cama_ardente
    LEFT JOIN endereco e ON e.id = f.endereco_id
    LEFT JOIN falecido fal ON fal.id = f.falecido_id
    LEFT JOIN pedido_produtos pp ON pp.pedido_id = pe.id
    LEFT JOIN produtos p ON p.id = pp.produto_id
    WHERE pe.id = ? AND pe.usuario_id = ?
    GROUP BY pe.id, pe.status, pe.criado_em, c.cliente, c.data, c.valor, c.forma_de_pagamento,
             f.cremacao, f.horario, f.translado,
             n.roupa, n.r_intimas, n.batom, n.unha, n.observacao, n.intensidade, n.cabelo,
             l.embacamento, l.tanatopraxia, l.aspiracao, l.restauracao, l.mumificacao, l.higienizacao,
             ca.cortina, ca.tapete, ca.livropre, ca.veleiro, ca.cristo, ca.biblia, ca.cavalete,
             e.numero, e.rua, e.bairro, e.cidade, e.estado, e.pais,
             fal.nome, fal.idade, fal.cpf, fal.rg, fal.data_falecimento, fal.local_falecimento, fal.foto, fal.comprovante_residencia
  `;
  
  db.query(sql, [pedidoId, userId], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, null);

    const pedido = results[0];
    callback(null, pedido);
  });
};



module.exports = Pedido;
