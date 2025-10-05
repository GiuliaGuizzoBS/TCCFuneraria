const express = require('express');
const router = express.Router();
const db = require('../config/db'); // ✅ Importa diretamente o banco
const { verificarLogin } = require('../middlewares/authMiddleware');

// Middleware para verificar se é admin
function verificarAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).send('Acesso negado.');
  }
}

router.use(verificarLogin);
router.use(verificarAdmin);

// Listar todos os pedidos finalizados (de todos os usuários)
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      pe.id AS pedido_id,
      pe.status,
      pe.criado_em,
      u.username AS usuario_nome,
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
    LEFT JOIN users u ON u.id = pe.usuario_id
    LEFT JOIN contrata c ON c.pedido_id = pe.id
    LEFT JOIN formulario f ON f.usuario_id = pe.usuario_id
    LEFT JOIN necromaquiagem n ON n.id = f.necromaquiagem
    LEFT JOIN laboratorio l ON l.id = f.laboratorio
    LEFT JOIN cama_ardente ca ON ca.id = f.cama_ardente
    LEFT JOIN endereco e ON e.id = f.endereco_id
    LEFT JOIN pedido_produtos pp ON pp.pedido_id = pe.id
    LEFT JOIN produtos p ON p.id = pp.produto_id
    WHERE pe.status = 'finalizado'
    GROUP BY 
      pe.id, pe.status, pe.criado_em, u.username,
      c.cliente, c.data, c.valor, c.forma_de_pagamento,
      f.cremacao, f.horario, f.translado,
      n.roupa, n.r_intimas, n.batom, n.unha, n.observacao, n.intensidade, n.cabelo,
      l.embacamento, l.tanatopraxia, l.aspiracao, l.restauracao, l.mumificacao, l.higienizacao,
      ca.cortina, ca.tapete, ca.livropre, ca.veleiro, ca.cristo, ca.biblia, ca.cavalete,
      e.numero, e.rua, e.bairro, e.cidade, e.estado, e.pais
    ORDER BY pe.criado_em DESC
  `;

  db.query(sql, (err, pedidos) => {
    if (err) {
      console.error('Erro ao buscar pedidos:', err);
      return res.status(500).send('Erro ao carregar pedidos.');
    }

    res.render('pedidosGerenciador', { pedidos });
  });
});

module.exports = router;
