const express = require('express');
const User = require('../models/userModel'); // pega o model do banco

const router = express.Router();

// Página de login
router.get('/', (req, res) => {
  res.render('login', { erro: null });
});

// Ação de login
router.post('/', (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, (err, user) => {
    if (err) {
      console.error(err);
      return res.render('login', { erro: 'Erro no servidor. Tente novamente.' });
    }

    if (!user) {
      return res.render('login', { erro: 'Usuário ou senha inválidos!' });
    }

    // 🔑 Validação simples (senha em texto puro)
    const senhaValida = (password === user.password);

    if (!senhaValida) {
      return res.render('login', { erro: 'Usuário ou senha inválidos!' });
    }

    // ✅ Login OK → cria sessão
    req.session.user = { id: user.id, username: user.username, role: user.role };
    return res.redirect('/gerenciador');
  });
});

module.exports = router;
