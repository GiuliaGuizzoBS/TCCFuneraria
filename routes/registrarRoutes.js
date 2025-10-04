const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

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

  // Verifica se o usuário já existe
  User.findByUsername(username, (err, existingUser) => {
    if (err) {
      console.error(err);
      return res.render('registrar', { erro: 'Erro no servidor. Tente novamente.', sucesso: null });
    }

    if (existingUser) {
      return res.render('registrar', { erro: 'Usuário já existe!', sucesso: null });
    }

    // Criptografa a senha antes de salvar
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error(err);
        return res.render('registrar', { erro: 'Erro ao processar senha.', sucesso: null });
      }

      const newUser = {
        username,
        password: hash, // senha com hash
        role: 'user'    // padrão
      };

      // Cria o novo usuário no banco
      User.create(newUser, (err) => {
        if (err) {
          console.error(err);
          return res.render('registrar', { erro: 'Erro ao criar conta.', sucesso: null });
        }

        // Redireciona para o login com mensagem de sucesso
        return res.redirect('/login?sucesso=1');
      });
    });
  });
});

module.exports = router;
