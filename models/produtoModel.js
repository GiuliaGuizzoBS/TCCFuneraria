const db = require('../config/db');

const Produto = {
  // 🔹 Buscar todos os produtos
  getAll: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, nome, descricao, preco, quantidade, categoria
        FROM produtos
        ORDER BY id DESC
      `;
      db.query(sql, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // 🔹 Buscar produtos por categoria (funerais, flores, homenagens)
  getAllByCategoria: (categoria) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, nome, descricao, preco, quantidade, categoria
        FROM produtos
        WHERE categoria = ?
        ORDER BY id DESC
      `;
      db.query(sql, [categoria], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // 🔹 Buscar um produto específico
  getById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, nome, descricao, preco, quantidade, categoria
        FROM produtos
        WHERE id = ?
      `;
      db.query(sql, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  // 🔹 Criar produto
  create: (produto) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO produtos (nome, descricao, preco, quantidade, categoria)
        VALUES (?, ?, ?, ?, ?)
      `;
      const { nome, descricao, preco, quantidade, categoria } = produto;
      db.query(sql, [nome, descricao, preco, quantidade, categoria], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  },

  // 🔹 Atualizar produto
  update: (id, produto) => {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE produtos
        SET nome = ?, descricao = ?, preco = ?, quantidade = ?, categoria = ?
        WHERE id = ?
      `;
      const { nome, descricao, preco, quantidade, categoria } = produto;
      db.query(sql, [nome, descricao, preco, quantidade, categoria, id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // 🔹 Excluir produto
  delete: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM produtos WHERE id = ?`;
      db.query(sql, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
};

module.exports = Produto;
