var express = require('express');
var router = express.Router();
const Produto = require('../models/produtoModel'); // importe o seu model de produtos

/* GET home page com produtos */
router.get('/', function(req, res, next) {
  Produto.getAll(null, (err, produtos) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao carregar produtos.');
    }
    res.render('index', { produtos, title: 'Página Inicial' }); // envia os produtos e o título para a view
  });
});

module.exports = router;
