const db = require('../config/db'); // ajusta o caminho conforme teu projeto

const Pedido = {
  // Criar um novo pedido para o usuário
  create: (dados, callback) => {
    const { usuario_id } = dados;
    const sql = 'INSERT INTO pedidos (usuario_id, status) VALUES (?, "aberto")';
    db.query(sql, [usuario_id], (err, result) => {
      if (err) return callback(err);
      callback(null, result.insertId);
    });
  },

  // Buscar os produtos de um pedido
  getProdutos: (pedidoId, callback) => {
    const sql = `
      SELECT 
        p.id,
        p.nome,
        p.descricao,
        p.preco,
        pp.quantidade
      FROM pedido_produtos pp
      JOIN produtos p ON pp.produto_id = p.id
      WHERE pp.pedido_id = ?
    `;
    db.query(sql, [pedidoId], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  // Adicionar produto ao pedido
  addProduto: (pedidoId, produtoId, quantidade, callback) => {
    // verifica se o produto já está no pedido
    const checkSql = 'SELECT id, quantidade FROM pedido_produtos WHERE pedido_id = ? AND produto_id = ?';
    db.query(checkSql, [pedidoId, produtoId], (err, results) => {
      if (err) return callback(err);

      if (results.length > 0) {
        // se já existe, só atualiza a quantidade
        const novoTotal = results[0].quantidade + quantidade;
        const updateSql = 'UPDATE pedido_produtos SET quantidade = ? WHERE id = ?';
        db.query(updateSql, [novoTotal, results[0].id], callback);
      } else {
        // senão, insere
        const insertSql = 'INSERT INTO pedido_produtos (pedido_id, produto_id, quantidade) VALUES (?, ?, ?)';
        db.query(insertSql, [pedidoId, produtoId, quantidade], callback);
      }
    });
  },

  // Remover produto do pedido
  removeProduto: (pedidoId, produtoId, callback) => {
    const sql = 'DELETE FROM pedido_produtos WHERE pedido_id = ? AND produto_id = ?';
    db.query(sql, [pedidoId, produtoId], callback);
  },

  // Finalizar o pedido (mudar status)
  fechar: (pedidoId, callback) => {
    const sql = 'UPDATE pedidos SET status = "finalizado" WHERE id = ?';
    db.query(sql, [pedidoId], callback);
  }
};

module.exports = Pedido;
