const express = require('express');
const router = express.Router();
const Produto = require('../models/produtoModel');
const { verificarLogin } = require('../middlewares/authMiddleware');

router.use(verificarLogin);

router.get('/', async (req, res) => {
  try {
    const produtos = await Produto.getAllByCategoria('flores');
    res.render('flores', { produtos, title: 'Arranjos Florais' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar produtos da categoria flores.');
  }
});

module.exports = router;
