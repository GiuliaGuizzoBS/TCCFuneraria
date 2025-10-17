const express = require('express');
const router = express.Router();
const Produto = require('../models/produtoModel');

// GET página inicial para o usuário
router.get('/', async (req, res) => {
  try {
    const produtos = await Produto.getAll(); // ← agora usa Promise corretamente
    res.render('index', { produtos, title: 'Bem-vindo à Loja' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar produtos para o usuário.');
  }
});

module.exports = router;
