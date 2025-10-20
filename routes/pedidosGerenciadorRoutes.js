const express = require('express');
const router = express.Router();
const Pedido = require('../models/pedidosModel');
const { verificarLogin } = require('../middlewares/authMiddleware');

router.use(verificarLogin);

// 🔹 Página principal do gerenciador: mostra todos os pedidos finalizados
router.get('/', (req, res) => {
  const user = req.session.user;

  if (user.role !== 'admin') {
    return res.status(403).send('Acesso negado');
  }

  Pedido.getTodos((err, pedidos) => {
    if (err) {
      console.error('Erro ao carregar pedidos:', err);
      return res.status(500).send('Erro ao carregar pedidos.');
    }

    res.render('pedidosGerenciador', { pedidos });
  });
});

// 🔹 Visualizar detalhes de um pedido específico
router.get('/:id', (req, res) => {
  const user = req.session.user;
  const pedidoId = req.params.id;

  if (user.role !== 'admin') {
    return res.status(403).send('Acesso negado');
  }

  Pedido.getByIdAdmin(pedidoId, (err, pedido) => {
    if (err) {
      console.error('Erro ao buscar pedido:', err);
      return res.status(500).send('Erro ao buscar pedido.');
    }

    if (!pedido) {
      return res.status(404).send('Pedido não encontrado.');
    }

    // 🔸 Corrigido: nome exato da view
    res.render('pedidoDetalhes', { pedido });
  });
});

module.exports = router;
