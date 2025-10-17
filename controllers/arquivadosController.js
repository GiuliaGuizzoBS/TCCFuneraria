const Arquivado = require('../models/arquivadosModel');

exports.arquivar = async (req, res) => {
  try {
    const { tipo, alvo_id } = req.body;
    const arquivado_por = req.session.user?.id;

    if (!arquivado_por) {
      return res.status(401).send('Usuário não logado.');
    }

    await Arquivado.arquivar(tipo, alvo_id, arquivado_por);
    res.redirect(req.get('referer') || '/arquivados');
  } catch (err) {
    console.error('Erro ao arquivar:', err);
    res.status(500).send('Erro ao arquivar item.');
  }
};

// função desarquivar (precisa existir!)
exports.desarquivar = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).send('ID não fornecido');

    await Arquivado.desarquivar(id);
    res.redirect(req.get('referer') || '/arquivados');
  } catch (err) {
    console.error('Erro ao desarquivar:', err);
    res.status(500).send('Erro ao desarquivar item.');
  }
};

exports.listar = async (req, res) => {
  try {
    const itens = await Arquivado.listar();
    res.render('arquivados/index', { itens });
  } catch (err) {
    console.error('Erro ao listar arquivados:', err);
    res.status(500).send('Erro ao listar itens arquivados.');
  }
};
