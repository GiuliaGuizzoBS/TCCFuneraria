const express = require('express');
const router = express.Router();
const Produto = require('../models/produtoModel');
const { verificarLogin } = require('../middlewares/authMiddleware');

router.use(verificarLogin);

router.get('/', (req, res) => {
  Produto.getAll('homenagens', (err, produtos) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao carregar produtos da categoria homenagens.');
    }
    // Renderiza a view homenagens.ejs passando os produtos
    res.render('homenagens', { produtos, title: 'Homenagens' });
  });
});

module.exports = router;
