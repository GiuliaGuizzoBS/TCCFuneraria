const express = require('express');
const router = express.Router();
const Produto = require('../models/produtoModel'); // usa o mesmo model, se necessário

// GET página inicial para o usuário
router.get('/', (req, res) => {
  Produto.getAll(null, (err, produtos) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao carregar produtos para o usuário.');
    }
    res.render('inicio', { produtos, title: 'Bem-vindo à Loja' }); // renderiza a view 'inicio.ejs'
  });
});

module.exports = router;
