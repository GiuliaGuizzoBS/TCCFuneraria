const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const { verificarLogin } = require('../middlewares/authMiddleware');

// Aplica o middleware de login a todas as rotas
router.use(verificarLogin);

// Rota para listar todos os produtos (com filtro opcional de categoria)
router.get('/', produtoController.getAllProdutos);

// Rota para mostrar formulário de criação
router.get('/new', produtoController.renderCreateForm);

// Rota para criar um novo produto
router.post('/', produtoController.createProduto);

// Rota para exibir um produto específico
router.get('/:id', produtoController.getProdutoById);

// (opcional: se já tiver essas rotas)
router.get('/:id/edit', produtoController.renderEditForm);
router.put('/:id', produtoController.updateProduto);
router.delete('/:id', produtoController.deleteProduto);

module.exports = router;
