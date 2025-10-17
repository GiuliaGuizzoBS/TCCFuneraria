const express = require('express');
const { verificarAdmin } = require('../middlewares/authMiddleware');
const Produto = require('../models/produtoModel');
const router = express.Router();

router.get('/', verificarAdmin, async (req, res) => {
  try {
    const produtos = await Produto.getAll(); // assume que getAll retorna Promise
    res.render('gerenciador', {
      user: req.session.user,
      produtos,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar produtos no gerenciador.');
  }
});

module.exports = router;
