const express = require('express');
const router = express.Router();

// Rota correta
router.get('/', (req, res) => {
  res.render('servicos', { title: 'servicos' });
});

module.exports = router;
