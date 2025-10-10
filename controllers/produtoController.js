const Produto = require('../models/produtoModel');

// Listar produtos
exports.getAllProdutos = (req, res) => {
  const categoria = req.query.categoria || null;
  Produto.getAll(categoria, (err, produtos) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao carregar produtos.');
    }

    const categorias = [
      { id: 1, nome: 'Funerais' },
      { id: 2, nome: 'Flores' },
      { id: 3, nome: 'Homenagens' }
    ];

    res.render('produtos/index', { produtos, categorias, categoriaSelecionada: categoria });
  });
};

// Formulário de criação
exports.renderCreateForm = (req, res) => {
  const categorias = [
    { id: 1, nome: 'Funerais' },
    { id: 2, nome: 'Flores' },
    { id: 3, nome: 'Homenagens' }
  ];
  res.render('produtos/create', { categorias });
};

// Criar produto
exports.createProduto = (req, res) => {
  const { nome, descricao, preco, quantidade, categoria } = req.body;
  const imagemUrl = req.file ? `/imagens/${req.file.filename}` : null;

  Produto.create({ nome, descricao, preco, quantidade, categoria }, imagemUrl, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao cadastrar produto.');
    }
    res.redirect('/produtos');
  });
};

// Mostrar produto
exports.getProdutoById = (req, res) => {
  const id = req.params.id;
  Produto.findById(id, (err, produto) => {
    if (err || !produto) {
      console.error(err);
      return res.status(404).send('Produto não encontrado.');
    }
    res.render('produtos/show', { produto });
  });
};

// Formulário de edição
exports.renderEditForm = (req, res) => {
  const id = req.params.id;
  Produto.findById(id, (err, produto) => {
    if (err || !produto) {
      console.error(err);
      return res.status(404).send('Produto não encontrado.');
    }
    const categorias = [
      { id: 1, nome: 'Funerais' },
      { id: 2, nome: 'Flores' },
      { id: 3, nome: 'Homenagens' }
    ];
    res.render('produtos/edit', { produto, categorias });
  });
};

// Atualizar produto
exports.updateProduto = (req, res) => {
  const id = req.params.id;
  const { nome, descricao, preco, quantidade, categoria } = req.body;
  const imagemUrl = req.file ? `/imagens/${req.file.filename}` : null;

  Produto.update(id, { nome, descricao, preco, quantidade, categoria }, imagemUrl, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao atualizar produto.');
    }
    res.redirect(`/produtos/${id}`);
  });
};

// Excluir produto
exports.deleteProduto = (req, res) => {
  const id = req.params.id;
  Produto.delete(id, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao excluir produto.');
    }
    res.redirect('/produtos');
  });
};
