const Produto = require('../models/produtoModel');

// Listar produtos
// Listar produtos (corrigido: ordem antiga->nova e exclui arquivados quando possível)
exports.getAllProdutos = async (req, res) => {
  try {
    const categoria = req.query.categoria || null;
    let produtos;

    if (categoria) {
      produtos = await Produto.getAllByCategoria(categoria);
    } else {
      produtos = await Produto.getAll();
    }

    // Inverter para MOSTRAR do mais antigo para o mais novo
    if (Array.isArray(produtos)) {
      produtos = produtos.slice().reverse(); // faz uma cópia e inverte
    }

    // Tentar remover produtos arquivados (se existir model/funcionalidade)
    try {
      const Arquivado = require('../models/arquivadosModel');
      // supondo que Arquivado.listar() retorna array de { tipo, alvo_id, ... }
      if (typeof Arquivado.listar === 'function') {
        const itensArquivados = await Arquivado.listar();
        const idsArquivados = new Set(
          itensArquivados
            .filter(i => i.tipo === 'produto')
            .map(i => Number(i.alvo_id))
        );
        produtos = produtos.filter(p => !idsArquivados.has(Number(p.id)));
      }
    } catch (err) {
      // se não existir o model ou deu erro, não quebra: apenas não filtra
      // console.log('Model arquivados não disponível ou erro ao filtrar:', err.message);
    }

    const categorias = [
      { id: 1, nome: 'Funerais' },
      { id: 2, nome: 'Flores' },
      { id: 3, nome: 'Homenagens' }
    ];

    res.render('produtos/index', { produtos, categorias, categoriaSelecionada: categoria });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar produtos.');
  }
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
exports.createProduto = async (req, res) => {
  try {
    const { nome, descricao, preco, quantidade, categoria } = req.body;
    await Produto.create({ nome, descricao, preco, quantidade, categoria });
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

    if (!produto) {
      return res.status(404).send('Produto não encontrado.');
    }

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

    if (!produto) {
      return res.status(404).send('Produto não encontrado.');
    }

    const categorias = [
      { id: 1, nome: 'Funerais' },
      { id: 2, nome: 'Flores' },
      { id: 3, nome: 'Homenagens' }
    ];

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
    await Produto.update(id, { nome, descricao, preco, quantidade, categoria });
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
