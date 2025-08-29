const express = require('express');
const { verificarAdmin } = require('../middlewares/authMiddleware');
const Produto = require('../models/produtoModel');

const router = express.Router();

router.get('/', verificarAdmin, (req, res) => {
  Produto.getAll(null, (err, produtos) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao carregar produtos no gerenciador.');
    }

    res.render('gerenciador', { 
      user: req.session.user,
      produtos // agora a view recebe essa variável
    });
  });
});

module.exports = router;
