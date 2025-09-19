// routes/logoutRoutes.js
const express = require('express');
const router = express.Router();

// Rota para finalizar a sessão do usuário
router.get('/', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Erro ao encerrar sessão:', err);
      return res.status(500).send('Erro ao sair. Tente novamente.');
    }
    // Remove o cookie da sessão
    res.clearCookie('connect.sid');
    // Redireciona para a página inicial (ou login, se preferir)
    res.redirect('/');
  });
});

module.exports = router;
