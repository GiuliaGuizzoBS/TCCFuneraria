const express = require('express');
const categoriaController = require('../controllers/categoriaController');
const { verificarAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// 🔒 todas as rotas de produtos só admin acessa
router.use(verificarAdmin);
router.get('/', categoriaController.getAllCategorias);
router.get('/new', categoriaController.renderCreateForm);
router.post('/', categoriaController.createCategoria);
router.get('/:id', categoriaController.getCategoriaById);
router.get('/:id/edit', categoriaController.renderEditForm);
router.put('/:id', categoriaController.updateCategoria);
router.delete('/:id', categoriaController.deleteCategoria);

module.exports = router;