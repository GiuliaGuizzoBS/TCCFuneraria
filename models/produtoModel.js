const db = require('../config/db');

const Produto = {
  // Criar produto + imagem
  create: (produto, imagemUrl, callback) => {
    const query = `
      INSERT INTO produtos (nome, descricao, preco, quantidade, categoria)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [produto.nome, produto.descricao, produto.preco, produto.quantidade, produto.categoria],
      (err, result) => {
        if (err) return callback(err);

        const produtoId = result.insertId;

        if (imagemUrl) {
          const imgQuery = `
            INSERT INTO imagens (url, descricao, produto_id)
            VALUES (?, ?, ?)
          `;
          db.query(imgQuery, [imagemUrl, produto.nome, produtoId], callback);
        } else {
          callback(null);
        }
      }
    );
  },

  getAll: (categoria, callback) => {
    let query = `
      SELECT p.*, i.url AS imagem_url
      FROM produtos p
      LEFT JOIN imagens i ON p.id = i.produto_id
    `;
    const params = [];
    if (categoria) {
      query += ' WHERE p.categoria = ?';
      params.push(categoria);
    }
    db.query(query, params, callback);
  },

  findById: (id, callback) => {
    const query = `
      SELECT p.*, i.url AS imagem_url, i.descricao AS imagem_desc
      FROM produtos p
      LEFT JOIN imagens i ON p.id = i.produto_id
      WHERE p.id = ?
    `;
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  update: (id, produto, imagemUrl, callback) => {
    const query = `
      UPDATE produtos
      SET nome = ?, descricao = ?, preco = ?, quantidade = ?, categoria = ?
      WHERE id = ?
    `;
    db.query(
      query,
      [produto.nome, produto.descricao, produto.preco, produto.quantidade, produto.categoria, id],
      (err) => {
        if (err) return callback(err);

        if (imagemUrl) {
          const imgQuery = `
            INSERT INTO imagens (url, descricao, produto_id)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE 
              url = VALUES(url),
              descricao = VALUES(descricao)
          `;
          db.query(imgQuery, [imagemUrl, produto.nome, id], callback);
        } else {
          callback(null);
        }
      }
    );
  },

  delete: (id, callback) => {
    db.query('DELETE FROM imagens WHERE produto_id = ?', [id], (err) => {
      if (err) return callback(err);
      db.query('DELETE FROM produtos WHERE id = ?', [id], callback);
    });
  },
};

module.exports = Produto;
