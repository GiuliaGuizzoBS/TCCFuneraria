const express = require('express');
const User = require('../models/userModel');
const Pedido = require('../models/pedidosModel');

const router = express.Router();

// Página de login
router.get('/', (req, res) => {
  const sucesso = req.query.sucesso;
  res.render('login', { erro: null, sucesso });
});

// Ação de login
router.post('/', (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, (err, user) => {
    if (err) return res.render('login', { erro: 'Erro no servidor', sucesso: null });
    if (!user) return res.render('login', { erro: 'Usuário ou senha inválidos', sucesso: null });

    const senhaValida = password === user.password;
    if (!senhaValida) return res.render('login', { erro: 'Usuário ou senha inválidos', sucesso: null });

    // Salva dados corretos na sessão
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role.toLowerCase()
    };

    // Recupera pedido em aberto (se existir)
    Pedido.getPedidoAberto(user.id, (err, pedido) => {
      if (!err && pedido) {
        req.session.pedido_id = pedido.id;
      }

      // Redireciona por role
      if (user.role.toLowerCase() === 'admin') {
        return res.redirect('/gerenciador');
      } else {
        return res.redirect('/');
      }
    });
  });
});

module.exports = router;
