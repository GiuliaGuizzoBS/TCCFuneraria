const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Usuario = require('../models/userModel'); // você precisa ter esse model
const session = require('express-session');

// Middleware de proteção (opcional)
function verificarAutenticacao(req, res, next) {
  if (req.session && req.session.usuarioId) {
    return next();
  } else {
    res.redirect('/login');
  }
}

// Rota para exibir o formulário de login
router.get('/', (req, res) => {
 res.render('login', { title: 'Entrar no Sistema', erro: null });
});

// Rota para processar o login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findByEmail(email); // implementa esse método no model

    if (!usuario) {
      return res.status(401).render('login', { title: 'Entrar no Sistema', erro: 'Usuário não encontrado.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).render('login', { title: 'Entrar no Sistema', erro: 'Senha incorreta.' });
    }

    // Login bem-sucedido
    req.session.usuarioId = usuario.id;
    req.session.nomeUsuario = usuario.nome;
    res.redirect('/painel'); // redireciona para área protegida
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao processar login.');
  }
});

// Rota para logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Erro ao sair.');
    }
    res.redirect('/login');
  });
});

module.exports = router;
