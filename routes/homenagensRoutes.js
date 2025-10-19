const express = require('express');
const router = express.Router();
const Produto = require('../models/produtoModel');
const { verificarLogin } = require('../middlewares/authMiddleware');

router.use(verificarLogin);

router.get('/', async (req, res) => {
  try {
    const produtos = await Produto.getAllByCategoria('homenagens');
    res.render('homenagens', { produtos, title: 'Homenagens Especiais' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar produtos da categoria homenagens.');
  }
});

module.exports = router;
