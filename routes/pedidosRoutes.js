const express = require('express');
const router = express.Router();
const Pedido = require('../models/pedidosModel');
const { verificarLogin } = require('../middlewares/authMiddleware');

router.use(verificarLogin);

// Mostrar produtos em aberto e pedidos confirmados
router.get('/', (req, res) => {
  const user = req.session.user;
  const userId = user.role === 'admin' ? null : user.id; // admin vê todos

  const sucesso = req.query.sucesso === '1' ? true : false; // 👈 variável para notificação

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

      res.render('pedidos', { produtos, confirmados, sucesso }); // 👈 envia pro EJS
    });
  });
});

// Adicionar produto ao pedido
router.post('/adicionar', (req, res) => {
  const { produto_id, quantidade } = req.body;
  const usuarioId = req.session.user.id;

  // 🔹 Buscar pedido aberto antes de criar
  Pedido.getEmAbertoPorUsuario(usuarioId, (err, pedidoAberto) => {
    if (err) return res.status(500).send(err);

    if (!pedidoAberto) {
      // Nenhum pedido aberto, criar um novo
      Pedido.create(usuarioId, (err2, novoPedido) => {
        if (err2) return res.status(500).send(err2);

        req.session.pedido_id = novoPedido.id;

        Pedido.addProduto(novoPedido.id, produto_id, quantidade || 1, (err3) => {
          if (err3) return res.status(500).send(err3);
          res.redirect('/pedidos');
        });
      });
    } else {
      // Já existe pedido aberto, só adiciona produto
      req.session.pedido_id = pedidoAberto.id;

      Pedido.addProduto(pedidoAberto.id, produto_id, quantidade || 1, (err4) => {
        if (err4) return res.status(500).send(err4);
        res.redirect('/pedidos');
      });
    }
  });
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
// Página de detalhes de um pedido específico
router.get('/:id', (req, res) => {
  const pedidoId = req.params.id;
  const user = req.session.user;

  Pedido.getById(pedidoId, user.role, user.id, (err, pedido) => {
    if (err) {
      console.error('Erro ao buscar detalhes do pedido:', err);
      return res.status(500).send('Erro ao buscar detalhes do pedido.');
    }

    if (!pedido) {
      return res.status(404).send('Pedido não encontrado.');
    }

    // Renderiza a tela pedidosDetalhes.ejs
res.render('pedidoDetalhes', { pedido, user: req.session.user });

  });
});

module.exports = router;
