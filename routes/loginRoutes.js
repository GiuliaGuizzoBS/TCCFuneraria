const express = require('express');
const bcrypt = require('bcrypt');
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

    bcrypt.compare(password, user.password, (err, senhaValida) => {
      if (err || !senhaValida) {
        return res.render('login', { erro: 'Usuário ou senha inválidos', sucesso: null });
      }

      // Senha válida: salva na sessão
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role.toLowerCase()
      };

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
});

module.exports = router;
