const express = require('express');
const User = require('../models/userModel'); // model do banco

const router = express.Router();

// Página de registro
router.get('/', (req, res) => {
  res.render('registrar', { erro: null, sucesso: null });
});

// Ação de registro
router.post('/', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('registrar', { erro: 'Preencha todos os campos!', sucesso: null });
  }

  // Verifica se já existe usuário com o mesmo nome
  User.findByUsername(username, (err, existingUser) => {
    if (err) {
      console.error(err);
      return res.render('registrar', { erro: 'Erro no servidor. Tente novamente.', sucesso: null });
    }

    if (existingUser) {
      return res.render('registrar', { erro: 'Usuário já existe!', sucesso: null });
    }

    // Cria novo usuário → role padrão = 'user'
    const bcrypt = require('bcrypt');

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error(err);
    return res.render('registrar', { erro: 'Erro ao processar senha.', sucesso: null });
  }

  const newUser = {
    username,
    password: hash, // ✔️ senha criptografada
    role: 'user'
  };

  User.create(newUser, (err, result) => {
    if (err) {
      console.error(err);
      return res.render('registrar', { erro: 'Erro ao criar conta.', sucesso: null });
    }

    return res.redirect('/login?sucesso=1');
  });
});


    User.create(newUser, (err, result) => {
      if (err) {
        console.error(err);
        return res.render('registrar', { erro: 'Erro ao criar conta.', sucesso: null });
      }

      return res.redirect('/login?sucesso=1');

    });
  });
});

module.exports = router;
