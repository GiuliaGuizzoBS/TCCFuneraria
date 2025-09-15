const express = require('express');
const router = express.Router();
const Pedido = require('../models/pedidosModel');
const { verificarLogin } = require('../middlewares/authMiddleware');

router.use(verificarLogin);

// Mostrar produtos do pedido (carrinho)
router.get('/', (req, res) => {
  const pedidoId = req.session.pedido_id; // assumindo que o pedido do usuário está na sessão
  if (!pedidoId) return res.render('pedidos', { produtos: [] });

  Pedido.getProdutos(pedidoId, (err, produtos) => {
    if (err) return res.status(500).send('Erro ao carregar o pedido.');
    res.render('pedidos', { produtos });
  });
});

// Adicionar produto ao pedido
router.post('/adicionar', (req, res) => {
  const { produto_id, quantidade } = req.body;
  let pedidoId = req.session.pedido_id;

  if (!pedidoId) {
    // cria um pedido novo
    Pedido.create({ usuario_id: req.session.usuario_id }, (err, id) => {
      if (err) return res.status(500).send(err);
      req.session.pedido_id = id;
      Pedido.addProduto(id, produto_id, quantidade || 1, (err2) => {
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

// Finalizar pedido
router.post('/finalizar', (req, res) => {
  const pedidoId = req.session.pedido_id;
  if (!pedidoId) return res.redirect('/pedidos');

  Pedido.fechar(pedidoId, (err) => {
    if (err) return res.status(500).send(err);
    req.session.pedido_id = null;
    res.redirect('/pedidos');
  });
});

module.exports = router;
