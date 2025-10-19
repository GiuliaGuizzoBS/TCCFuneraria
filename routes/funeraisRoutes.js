const express = require('express');
const router = express.Router();
const Produto = require('../models/produtoModel');
const { verificarLogin } = require('../middlewares/authMiddleware');

router.use(verificarLogin);

router.get('/', async (req, res) => {
  try {
    const produtos = await Produto.getAllByCategoria('funerais');
    res.render('funerais', { produtos, title: 'Serviços Funerários' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar produtos da categoria funerais.');
  }
});

module.exports = router;
