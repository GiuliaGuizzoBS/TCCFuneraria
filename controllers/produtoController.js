const Produto = require('../models/produtoModel');

// Listar produtos
exports.getAllProdutos = async (req, res) => {
  try {
    const categoria = req.query.categoria || null;
    let produtos = categoria
      ? await Produto.getAllByCategoria(categoria)
      : await Produto.getAll();

    produtos = produtos.slice().reverse(); // do mais antigo para o mais novo

    // categorias como objetos para o select funcionar
    const categorias = [
      { id: 1, nome: 'funerais' },
      { id: 2, nome: 'flores' },
      { id: 3, nome: 'homenagens' }
    ];

    res.render('produtos/index', { produtos, categorias, categoriaSelecionada: categoria });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar produtos.');
  }
};

// Formulário criação
exports.renderCreateForm = (req, res) => {
  const categorias = [
    { id: 1, nome: 'funerais' },
    { id: 2, nome: 'flores' },
    { id: 3, nome: 'homenagens' }
  ];
  res.render('produtos/create', { categorias });
};

// Criar produto
exports.createProduto = async (req, res) => {
  try {
    const { nome, descricao, preco, quantidade, categoria } = req.body;

    // Cria o produto sem imagem
    const produtoId = await Produto.create({ nome, descricao, preco, quantidade, categoria });

    // Se tiver imagem enviada, adiciona na tabela imagens
    if (req.file) {
      await Produto.addImagem(produtoId, `/imagens/${req.file.filename}`, '');
    }

    res.redirect('/produtos');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao cadastrar produto.');
  }
};

// Mostrar produto
exports.getProdutoById = async (req, res) => {
  try {
    const id = req.params.id;
    const produto = await Produto.getById(id);
    if (!produto) return res.status(404).send('Produto não encontrado.');

    // Pega todas imagens do produto
    const imagens = await Produto.getImagensByProdutoId(id);
    produto.imagens = imagens; // adiciona array de imagens ao produto
    produto.imagem = imagens[0]?.url ?? null; // primeira imagem para mostrar

    res.render('produtos/show', { produto });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar produto.');
  }
};

// Formulário de edição
exports.renderEditForm = async (req, res) => {
  try {
    const id = req.params.id;
    const produto = await Produto.getById(id);
    if (!produto) return res.status(404).send('Produto não encontrado.');

    const categorias = [
      { id: 1, nome: 'funerais' },
      { id: 2, nome: 'flores' },
      { id: 3, nome: 'homenagens' }
    ];

    // pega imagens do produto
    const imagens = await Produto.getImagensByProdutoId(id);
    produto.imagens = imagens;
    produto.imagem = imagens[0]?.url ?? null;

    res.render('produtos/edit', { produto, categorias });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar formulário de edição.');
  }
};

// Atualizar produto
exports.updateProduto = async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, descricao, preco, quantidade, categoria } = req.body;
    const updateData = { nome, descricao, preco, quantidade, categoria };

    // Se houver nova imagem, adiciona na tabela imagens e usa como primeira
    if (req.file) {
       await Produto.addImagem(id, `/imagens/${req.file.filename}`, '');
      updateData.imagem = `/imagens/${req.file.filename}`;
    }

    await Produto.update(id, updateData);
    res.redirect(`/produtos/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar produto.');
  }
};

// Excluir produto
exports.deleteProduto = async (req, res) => {
  try {
    const id = req.params.id;
    await Produto.delete(id);
    res.redirect('/produtos');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao excluir produto.');
  }
};
