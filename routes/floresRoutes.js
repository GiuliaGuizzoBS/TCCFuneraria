const express = require('express');
const router = express.Router();
const { verificarLogin } = require('../middlewares/authMiddleware');
const Produto = require('../models/produtoModel');

router.use(verificarLogin);

router.get('/', (req, res) => {
  Produto.getAll(7, (err, produtos) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao carregar produtos da categoria flores.');
    }
    res.render('flores', { produtos, title: 'Arranjos Florais' });
  });
});

module.exports = router;
