const Produto = require('../models/produtoModel');
const Categoria = require('../models/categoriaModel');

const produtoController = {

  // Criar novo produto
  createProduto: (req, res) => {
    const newProduto = {
      nome: req.body.nome,
      descricao: req.body.descricao,
      preco: req.body.preco,
      quantidade: req.body.quantidade,
      categoria: req.body.categoria
    };

    Produto.create(newProduto, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err });
      }
      res.redirect('/produtos');
    });
  },

  // Listar todos os produtos (com filtro opcional por categoria)
  getAllProdutos: (req, res) => {
    const categoria = req.query.categoria || null;
    Produto.getAll(categoria, (err, produtos) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err });
      }

      Categoria.getAll((err, categorias) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: err });
        }

        res.render('produtos/index', {
          produtos,
          categorias,
          categoriaSelecionada: categoria
        });
      });
    });
  },

  // Exibir um produto pelo ID
  getProdutoById: (req, res) => {
    const produtoId = req.params.id;

    Produto.findById(produtoId, (err, produto) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err });
      }
      if (!produto) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      res.render('produtos/show', { produto });
    });
  },

  // Renderizar formulário de criação
  renderCreateForm: (req, res) => {
    Categoria.getAll((err, categorias) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err });
      }
      res.render('produtos/create', { categorias });
    });
  },

  // Renderizar formulário de edição
  renderEditForm: (req, res) => {
    const produtoId = req.params.id;

    Produto.findById(produtoId, (err, produto) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err });
      }

      Categoria.getAll((err, categorias) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: err });
        }

        res.render('produtos/edit', { produto, categorias });
      });
    });
  },

  // Atualizar produto
  updateProduto: (req, res) => {
    const produtoId = req.params.id;
    const updatedProduto = {
      nome: req.body.nome,
      descricao: req.body.descricao,
      preco: req.body.preco,
      quantidade: req.body.quantidade,
      categoria: req.body.categoria
    };

    Produto.update(produtoId, updatedProduto, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err });
      }
      res.redirect('/produtos');
    });
  },

  // Deletar produto
  deleteProduto: (req, res) => {
    const produtoId = req.params.id;

    Produto.delete(produtoId, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err });
      }
      res.redirect('/produtos');
    });
  }
};
        updateProduto: (req, res) => {
  const produtoId = req.params.id;
  const updatedProduto = {
    nome: req.body.nome,
    descricao: req.body.descricao,
    preco: req.body.preco,
    quantidade: req.body.quantidade,
    categoria: req.body.categoria
  };

  Produto.update(produtoId, updatedProduto, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err });
    }
    res.redirect('/produtos');
  });
}


module.exports = produtoController;
