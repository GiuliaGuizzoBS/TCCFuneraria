const multer = require('multer');
const path = require('path');

// Configuração do destino e nome do arquivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/imagens'); // tua pasta já existente
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// Filtro de tipos de arquivo
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
    return cb(new Error('Apenas imagens PNG, JPG, JPEG ou WEBP são permitidas.'));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
