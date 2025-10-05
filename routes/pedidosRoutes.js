const express = require('express');
const router = express.Router();
const Pedido = require('../models/pedidosModel');
const { verificarLogin } = require('../middlewares/authMiddleware');

router.use(verificarLogin);

// Mostrar produtos em aberto e pedidos confirmados
router.get('/', (req, res) => {
  const userId = req.session.user.id;

  Pedido.getEmAberto(userId, (err, produtos) => {
    if (err) {
      console.error('Erro ao carregar pedidos abertos:', err);
      return res.status(500).send('Erro ao carregar pedidos abertos.');
    }

    Pedido.getConfirmados(userId, (err2, confirmados) => {
      if (err2) {
        console.error('Erro ao carregar pedidos confirmados:', err2);
        return res.status(500).send('Erro ao carregar pedidos confirmados.');
      }

      res.render('pedidos', { produtos, confirmados });
    });
  });
});

// Adicionar produto ao pedido
router.post('/adicionar', (req, res) => {
  const { produto_id, quantidade } = req.body;
  let pedidoId = req.session.pedido_id;

  if (!pedidoId) {
    Pedido.create(req.session.user.id, (err, pedido) => {
      if (err) return res.status(500).send(err);

      req.session.pedido_id = pedido.id;

      Pedido.addProduto(pedido.id, produto_id, quantidade || 1, (err2) => {
        if (err2) return res.status(500).send(err2);
        res.redirect('/pedidos');
      });
    });
  } else {
    Pedido.addProduto(pedidoId, produto_id, quantidade || 1, (err) => {
      if (err) return res.status(500).send(err);
      res.redirect('/pedidos');
    });
  }
});

// Remover produto do pedido
router.post('/remover', (req, res) => {
  const { produto_id } = req.body;
  const pedidoId = req.session.pedido_id;
  if (!pedidoId) return res.redirect('/pedidos');

  Pedido.removeProduto(pedidoId, produto_id, (err) => {
    if (err) return res.status(500).send(err);
    res.redirect('/pedidos');
  });
});

// Finalizar pedido → redireciona para o formulário
router.post('/finalizar', (req, res) => {
  res.redirect('/formulario');
});

module.exports = router;
