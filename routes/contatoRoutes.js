const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('contato', { title: 'Contato' });
});

module.exports = router;
