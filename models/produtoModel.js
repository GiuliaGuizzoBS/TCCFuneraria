const db = require('../config/db');

const Produto = {
  // 🔹 Buscar todos os produtos (exceto arquivados)
  getAll: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT p.id, p.nome, p.descricao, p.preco, p.quantidade, p.categoria,
               (SELECT url FROM imagens WHERE produto_id = p.id LIMIT 1) AS imagem
        FROM produtos p
        LEFT JOIN arquivados a 
          ON a.alvo_id = p.id AND a.tipo = 'produto'
        WHERE a.id IS NULL
        ORDER BY p.id DESC
      `;
      db.query(sql, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  getAllByCategoria: (categoria) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT p.id, p.nome, p.descricao, p.preco, p.quantidade, p.categoria,
               (SELECT url FROM imagens WHERE produto_id = p.id LIMIT 1) AS imagem
        FROM produtos p
        LEFT JOIN arquivados a 
          ON a.alvo_id = p.id AND a.tipo = 'produto'
        WHERE a.id IS NULL AND p.categoria = ?
        ORDER BY p.id DESC
      `;
      db.query(sql, [categoria], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT p.id, p.nome, p.descricao, p.preco, p.quantidade, p.categoria,
               (SELECT url FROM imagens WHERE produto_id = p.id LIMIT 1) AS imagem
        FROM produtos p
        WHERE p.id = ?
      `;
      db.query(sql, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

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

  update: (id, produto) => {
    return new Promise((resolve, reject) => {
      const campos = [];
      const valores = [];
      for (let [key, value] of Object.entries(produto)) {
        if (value !== undefined && value !== null) {
          campos.push(`${key} = ?`);
          valores.push(value);
        }
      }
      const sql = `UPDATE produtos SET ${campos.join(', ')} WHERE id = ?`;
      valores.push(id);
      db.query(sql, valores, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM produtos WHERE id = ?`;
      db.query(sql, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  addImagem: (produto_id, url, descricao) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO imagens (produto_id, url, descricao) VALUES (?, ?, ?)`;
      db.query(sql, [produto_id, url, descricao], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  },

  getImagensByProdutoId: (produto_id) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM imagens WHERE produto_id = ?`;
      db.query(sql, [produto_id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
};

module.exports = Produto;
