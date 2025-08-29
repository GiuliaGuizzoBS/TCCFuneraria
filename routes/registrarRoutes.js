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
    const newUser = {
      username,
      password, // ⚠️ por enquanto texto puro (depois podemos usar bcrypt)
      role: 'user'
    };

    User.create(newUser, (err, result) => {
      if (err) {
        console.error(err);
        return res.render('registrar', { erro: 'Erro ao criar conta.', sucesso: null });
      }

      return res.render('registrar', { erro: null, sucesso: 'Conta criada com sucesso! Faça login.' });
    });
  });
});

module.exports = router;
