const express = require('express');
const router = express.Router();
const Produto = require('../models/produtoModel');
const { verificarLogin } = require('../middlewares/authMiddleware');


router.use(verificarLogin);

router.get('/', (req, res) => {
  Produto.getAll(6, (err, produtos) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao carregar produtos da categoria flores.');
    }
    res.render('funerais', { produtos, title: 'Funerais' });
  });
});

module.exports = router;
