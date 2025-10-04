const db = require('../config/db'); // ⬅️ ESTA LINHA RESOLVE O ERRO
const Produto = {
  create: (produto, callback) => {
    const query = `
      INSERT INTO produtos (nome, descricao, preco, quantidade, categoria)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(
      query,
      [produto.nome, produto.descricao, produto.preco, produto.quantidade, produto.categoria],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result.insertId);
      }
    );
  },

  getAll: (categoria, callback) => {
    let query = 'SELECT * FROM produtos';
    const params = [];

    if (categoria) {
      query += ' WHERE categoria = ?';
      params.push(categoria);
    }

    db.query(query, params, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  findById: (id, callback) => {
    const query = 'SELECT * FROM produtos WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  // Novo método update
  update: (id, updatedProduto, callback) => {
    const query = `
      UPDATE produtos
      SET nome = ?, descricao = ?, preco = ?, quantidade = ?, categoria = ?
      WHERE id = ?
    `;
    db.query(
      query,
      [
        updatedProduto.nome,
        updatedProduto.descricao,
        updatedProduto.preco,
        updatedProduto.quantidade,
        updatedProduto.categoria,
        id
      ],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      }
    );
  }
};

module.exports = Produto;
