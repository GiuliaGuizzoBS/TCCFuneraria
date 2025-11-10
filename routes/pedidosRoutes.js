const express = require('express');
const router = express.Router();
const Pedido = require('../models/pedidosModel');
const { verificarLogin } = require('../middlewares/authMiddleware');

router.use(verificarLogin);

// ====================
// GET /pedidos
// ====================
router.get('/', async (req, res) => {
  try {
    const user = req.session.user;
    const userId = user.role === 'admin' ? null : user.id;
    const sucesso = req.query.sucesso === '1';

    // Carrega pedido em aberto
    const produtos = await new Promise((resolve, reject) => {
      Pedido.getEmAberto(userId, (err, result) => {
        if (err) return reject(err);
        resolve(result || []);
      });
    });

    // Carrega pedidos finalizados
    const confirmados = await new Promise((resolve, reject) => {
      Pedido.getConfirmados((err, result) => {
        if (err) return reject(err);
        resolve(result || []);
      });
    });

    res.render('pedidos', { produtos, confirmados, sucesso });
  } catch (err) {
    console.error('Erro ao carregar pedidos:', err);
    res.status(500).send('Erro ao carregar pedidos.');
  }
});

// ====================
// POST /pedidos/adicionar
// ====================
router.post('/adicionar', async (req, res) => {
  try {
    const { produto_id, quantidade } = req.body;
    const usuarioId = req.session.user.id;

    const pedidoAberto = await new Promise((resolve, reject) => {
      Pedido.getPedidoAberto(usuarioId, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    let pedidoId;
    if (!pedidoAberto) {
      const novoPedido = await new Promise((resolve, reject) => {
        Pedido.create(usuarioId, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
      pedidoId = novoPedido.id;
    } else {
      pedidoId = pedidoAberto.id;
    }

    req.session.pedido_id = pedidoId;

    await new Promise((resolve, reject) => {
      Pedido.addProduto(pedidoId, produto_id, quantidade || 1, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    res.redirect('/pedidos');
  } catch (err) {
    console.error('Erro ao adicionar produto:', err);
    res.status(500).send('Erro ao adicionar produto.');
  }
});

// ====================
// POST /pedidos/remover
// ====================
router.post('/remover', async (req, res) => {
  try {
    const { produto_id } = req.body;
    const pedidoId = req.session.pedido_id;
    if (!pedidoId) return res.redirect('/pedidos');

    await new Promise((resolve, reject) => {
      Pedido.removeProduto(pedidoId, produto_id, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    res.redirect('/pedidos');
  } catch (err) {
    console.error('Erro ao remover produto:', err);
    res.status(500).send('Erro ao remover produto.');
  }
});

// ====================
// POST /pedidos/finalizar
// ====================
router.post('/finalizar', (req, res) => {
  if (!req.session.pedido_id) return res.redirect('/pedidos');
  res.redirect('/formulario');
});

router.get('/:id', async (req, res) => {
  try {
    const pedidoId = req.params.id;
    const user = req.session.user;

    // Busca todos os detalhes do pedido, incluindo cpf, rg e número
    const pedido = await new Promise((resolve, reject) => {
      Pedido.getByIdAdmin(pedidoId, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    if (!pedido) return res.status(404).send('Pedido não encontrado.');
    res.render('pedidoDetalhes', { pedido, user });
  } catch (err) {
    console.error('Erro ao buscar detalhes do pedido:', err);
    res.status(500).send('Erro ao buscar detalhes do pedido.');
  }
});


module.exports = router;
