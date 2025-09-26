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
}

module.exports = Pedido;
