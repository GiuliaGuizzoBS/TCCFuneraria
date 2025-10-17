const db = require('../config/db');

const Arquivado = {
  arquivar: (tipo, alvo_id, arquivado_por) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO arquivados (tipo, alvo_id, arquivado_por, data_arquivado)
                   VALUES (?, ?, ?, NOW())`;
      db.query(sql, [tipo, alvo_id, arquivado_por], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

 listar: () => {
  return new Promise((resolve, reject) => {
    const sql = `
SELECT a.id, a.tipo, a.alvo_id, a.arquivado_por, a.data_arquivado,
       p.nome AS produto_nome, p.descricao AS produto_descricao,
       u.username AS arquivador_nome
FROM arquivados a
LEFT JOIN produtos p ON a.alvo_id = p.id AND a.tipo = 'produto'
LEFT JOIN users u ON a.arquivado_por = u.id
ORDER BY a.data_arquivado DESC;

    `;
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}
,

  // ✅ NOVO MÉTODO
desarquivar: (id) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM arquivados WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}
};

module.exports = Arquivado;
