const express = require("express");
const router = express.Router();
const db = require("../config/db");
const Pedido = require("../models/pedidosModel");
const { verificarLogin } = require("../middlewares/authMiddleware");

router.use(verificarLogin);

// Exibir formulário
router.get("/", (req, res) => {
  res.render("formulario", { user: req.session.user });
});

// Salvar formulário e finalizar pedido
router.post("/", (req, res) => {
  const {
    cremacao,
    horario,
    translado,
    roupa,
    r_intimas,
    batom,
    unha,
    observacao,
    intensidade,
    cabelo,
    embacamento,
    tanatopraxia,
    aspiracao,
    restauracao,
    mumificacao,
    higienizacao,
    cortina,
    tapete,
    livropre,
    veleiro,
    cristo,
    biblia,
    cavalete,
    numero,
    rua,
    bairro,
    cidade,
    estado,
    pais,
    valor,
    hora,
    data,
    forma_de_pagamento,
    cliente,
    observacoes
  } = req.body;

  const pedidoId = req.session.pedido_id;
  if (!pedidoId) return res.redirect("/pedidos");

  // 1️⃣ Inserir endereço
  const sqlEndereco = `
    INSERT INTO endereco (numero, rua, bairro, cidade, estado, pais)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sqlEndereco, [numero, rua, bairro, cidade, estado, pais], (err, resultEndereco) => {
    if (err) return res.status(500).send("Erro ao salvar endereço.");
    const enderecoId = resultEndereco.insertId;

    // 2️⃣ Inserir necromaquiagem
    const sqlNecro = `
      INSERT INTO necromaquiagem (roupa, r_intimas, batom, unha, observacao, intensidade, cabelo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sqlNecro, [roupa, r_intimas, batom, unha, observacao, intensidade, cabelo], (err, resultNecro) => {
      if (err) return res.status(500).send("Erro ao salvar necromaquiagem.");
      const necroId = resultNecro.insertId;

      // 3️⃣ Inserir laboratório
      const sqlLab = `
        INSERT INTO laboratorio (embacamento, tanatopraxia, aspiracao, restauracao, mumificacao, higienizacao)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(sqlLab, [embacamento, tanatopraxia, aspiracao, restauracao, mumificacao, higienizacao], (err, resultLab) => {
        if (err) return res.status(500).send("Erro ao salvar laboratório.");
        const labId = resultLab.insertId;

        // 4️⃣ Inserir cama ardente
        const sqlCama = `
          INSERT INTO cama_ardente (cortina, tapete, livropre, veleiro, cristo, biblia, cavalete)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(sqlCama, [cortina, tapete, livropre, veleiro, cristo, biblia, cavalete], (err, resultCama) => {
          if (err) return res.status(500).send("Erro ao salvar cama ardente.");
          const camaId = resultCama.insertId;

          // 5️⃣ Inserir formulário principal
          const sqlForm = `
            INSERT INTO formulario (cremacao, horario, translado, necromaquiagem, laboratorio, cama_ardente, endereco_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
          db.query(sqlForm, [cremacao, horario, translado, necroId, labId, camaId, enderecoId], (err, resultForm) => {
            if (err) return res.status(500).send("Erro ao salvar formulário principal.");

            // 6️⃣ Inserir contrato (contrata)
            const sqlContrata = `
              INSERT INTO contrata (valor, hora, data, assinatura, forma_de_pagamento, cliente, pedido_id)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            db.query(sqlContrata, [valor, hora, data, 1, forma_de_pagamento, cliente, pedidoId], (err) => {
              if (err) return res.status(500).send("Erro ao salvar contrato.");

              // 7️⃣ Atualizar status do pedido para finalizado
              Pedido.atualizarStatus(pedidoId, "finalizado", (err) => {
                if (err) return res.status(500).send("Erro ao finalizar pedido.");

                // Limpar pedido da sessão
                req.session.pedido_id = null;

                // Redirecionar para a página de pedidos confirmados
                res.redirect("/pedidos");
              });
            });
          });
        });
      });
    });
  });
});

module.exports = router;
