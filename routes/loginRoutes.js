const express = require('express');
const User = require('../models/userModel');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('login', { erro: null });
});

router.post('/', (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, (err, user) => {
    if (err) return res.render('login', { erro: 'Erro no servidor' });
    if (!user) return res.render('login', { erro: 'Usuário ou senha inválidos' });

    const senhaValida = password === user.password;
    if (!senhaValida) return res.render('login', { erro: 'Usuário ou senha inválidos' });

    // Salva dados corretos na sessão
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role.toLowerCase() // garante minúsculo
    };

    // Redireciona por role
    if (user.role.toLowerCase() === 'admin') {
      return res.redirect('/gerenciador');
    } else {
      return res.redirect('/'); // usuário comum
    }
  });
});

module.exports = router;
