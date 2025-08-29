const express = require('express');
const produtoController = require('../controllers/produtoController');
const { verificarAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// 🔒 todas as rotas de produtos só admin acessa
router.use(verificarAdmin);

router.get('/', produtoController.getAllProdutos);
router.get('/new', produtoController.renderCreateForm);
router.post('/', produtoController.createProduto);
router.get('/:id', produtoController.getProdutoById);
router.get('/:id/edit', produtoController.renderEditForm);
router.put('/:id', produtoController.updateProduto);
router.delete('/:id', produtoController.deleteProduto);

module.exports = router;