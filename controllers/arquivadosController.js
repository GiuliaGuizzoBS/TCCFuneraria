const Arquivado = require('../models/arquivadosModel');
const db = require('../config/db');

// 🔹 Função de arquivar
exports.arquivar = (req, res) => {
  const { tipo, alvo_id } = req.body;
  const arquivado_por = req.session?.user?.id || null;

  if (!tipo || !alvo_id) {
    return res.status(400).send('Dados inválidos para arquivamento.');
  }

  const checkSql = 'SELECT * FROM arquivados WHERE tipo = ? AND alvo_id = ?';
  db.query(checkSql, [tipo, alvo_id], (err, results) => {
    if (err) {
      console.error('Erro ao verificar arquivamento:', err);
      return res.status(500).send('Erro interno.');
    }

    if (results.length > 0) {
      console.log(`⚠️ ${tipo} ${alvo_id} já está arquivado.`);
      return res.redirect(`/${tipo === 'usuario' ? 'users' : 'produtos'}`);
    }

    const insertSql = `
      INSERT INTO arquivados (tipo, alvo_id, arquivado_por, data_arquivado)
      VALUES (?, ?, ?, NOW())
    `;
    db.query(insertSql, [tipo, alvo_id, arquivado_por], (err2) => {
      if (err2) {
        console.error('Erro ao arquivar:', err2);
        return res.status(500).send('Erro ao arquivar.');
      }

      // 🔹 Redireciona corretamente
      if (tipo === 'usuario') {
        return res.redirect('/users');
      } else if (tipo === 'produto') {
        return res.redirect('/produtos');
      } else {
        return res.redirect('/arquivados');
      }
    });
  });
};

// 🔹 Função desarquivar
exports.desarquivar = (req, res) => {
  const { id } = req.body;

  const sql = 'DELETE FROM arquivados WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) {
      console.error('Erro ao desarquivar:', err);
      return res.status(500).send('Erro ao desarquivar');
    }
    res.redirect('/arquivados');
  });
};

// 🔹 Corrige a listagem para separar produtos e usuários
exports.listar = async (req, res) => {
  try {
    const produtosArquivados = await Arquivado.listarProdutosArquivados(); // 🔹 só produtos
    const usuariosArquivados = await Arquivado.listarUsuariosArquivados(); // 🔹 só usuários

    res.render('arquivados/index', {
      itens: produtosArquivados, // mantém compatível com o nome no EJS
      usuariosArquivados
    });
  } catch (err) {
    console.error('Erro ao listar arquivados:', err);
    res.status(500).send('Erro ao listar itens arquivados.');
  }
};
