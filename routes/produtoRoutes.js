const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const produtoController = require('../controllers/produtoController');
const { verificarLogin } = require('../middlewares/authMiddleware');

// Configuração Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/imagens'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.use(verificarLogin);

router.get('/', produtoController.getAllProdutos);
router.get('/new', produtoController.renderCreateForm);
router.post('/', upload.single('imagem'), produtoController.createProduto);
router.get('/:id', produtoController.getProdutoById);
router.get('/:id/edit', produtoController.renderEditForm);
router.put('/:id', upload.single('imagem'), produtoController.updateProduto);
router.delete('/:id', produtoController.deleteProduto);

module.exports = router;
