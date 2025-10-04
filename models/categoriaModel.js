const db = require('../config/db');

// models/categoriaModel.js

const Categoria = {
  getAll: (callback) => {
    // Retorna as categorias fixas usadas no ENUM da tabela produtos
    const categorias = [
      { id: 'funerais', nome: 'Funerais' },
      { id: 'flores', nome: 'Flores' },
      { id: 'homenagens', nome: 'Homenagens' }
    ];
    callback(null, categorias);
  }
};


module.exports = Categoria;