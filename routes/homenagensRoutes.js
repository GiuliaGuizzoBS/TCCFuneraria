const express = require('express');
const router = express.Router();
const Produto = require('../models/produtoModel');

router.get('/', (req, res) => {
  Produto.getAll(8, (err, produtos) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao carregar produtos da categoria homenagens.');
    }
    res.render('homenagens', { produtos, title: 'Homenagens' });
  });
});

module.exports = router;
