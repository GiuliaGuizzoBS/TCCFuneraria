const express = require('express');
const router = express.Router();
const arquivadoController = require('../controllers/arquivadosController');

// Arquivar item
router.post('/arquivar', arquivadoController.arquivar);

// Desarquivar item
router.post('/desarquivar', arquivadoController.desarquivar);

// Listar itens arquivados
router.get('/', arquivadoController.listar);

module.exports = router;
