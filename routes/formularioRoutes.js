const express = require("express");
const router = express.Router();
const db = require("../config/db");
const Pedido = require("../models/pedidosModel");
const { verificarLogin } = require("../middlewares/authMiddleware");
const { gerarPdfPedido } = require("../utils/gerarPdf");
const upload = require('../config/multerConfig');

router.use(verificarLogin);

// Exibir formulário
router.get("/", (req, res) => {
  res.render("formulario", { user: req.session.user });
});

// Salvar formulário e finalizar pedido
router.post(
  "/",
  upload.fields([
    { name: "foto_falecido", maxCount: 1 },
    { name: "comprovante_residencia", maxCount: 1 },
  ]),
  (req, res) => {
    const {
      falecido_nome,
      falecido_idade,
      falecido_cpf,
      falecido_rg,
      falecido_data_falecimento,
      falecido_local_falecimento,
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
      embalsamamento,
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
      forma_de_pagamento,
      cliente,
    } = req.body;

    const pedidoId = req.session.pedido_id;
    if (!pedidoId) return res.redirect("/pedidos");

    const foto = req.files["foto_falecido"] ? req.files["foto_falecido"][0].filename : null;
    const comprovante = req.files["comprovante_residencia"] ? req.files["comprovante_residencia"][0].filename : null;

    // 1️⃣ Falecido
    const sqlFalecido = `
      INSERT INTO falecido
      (nome, idade, cpf, rg, data_falecimento, local_falecimento, foto, comprovante_residencia)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      sqlFalecido,
      [
        falecido_nome,
        falecido_idade || null,
        falecido_cpf || null,
        falecido_rg || null,
        falecido_data_falecimento || null,
        falecido_local_falecimento || null,
        foto,
        comprovante,
      ],
      (err, resultFalecido) => {
        if (err) return res.status(500).send("Erro ao salvar falecido.");
        const falecidoId = resultFalecido.insertId;

        // 2️⃣ Endereço
        const sqlEndereco = `
          INSERT INTO endereco (numero, rua, bairro, cidade, estado, pais)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(
          sqlEndereco,
          [numero, rua, bairro, cidade, estado, pais],
          (err, resultEndereco) => {
            if (err) return res.status(500).send("Erro ao salvar endereço.");
            const enderecoId = resultEndereco.insertId;

            // 3️⃣ Necromaquiagem
            const sqlNecro = `
              INSERT INTO necromaquiagem (roupa, r_intimas, batom, unha, observacao, intensidade, cabelo)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            db.query(
              sqlNecro,
              [roupa || null, r_intimas || 0, batom || null, unha || null, observacao || null, intensidade || 0, cabelo || null],
              (err, resultNecro) => {
                if (err) return res.status(500).send("Erro ao salvar necromaquiagem.");
                const necroId = resultNecro.insertId;

                // 4️⃣ Laboratório (corrigido embacamento -> embalsamamento)
                const sqlLab = `
                  INSERT INTO laboratorio (embacamento, tanatopraxia, aspiracao, restauracao, mumificacao, higienizacao)
                  VALUES (?, ?, ?, ?, ?, ?)
                `;
                db.query(
                  sqlLab,
                  [
                    embalsamamento ? 1 : 0,
                    tanatopraxia ? 1 : 0,
                    aspiracao ? 1 : 0,
                    restauracao ? 1 : 0,
                    mumificacao ? 1 : 0,
                    higienizacao ? 1 : 0,
                  ],
                  (err, resultLab) => {
                    if (err) return res.status(500).send("Erro ao salvar laboratório.");
                    const labId = resultLab.insertId;

                    // 5️⃣ Cama Ardente
                    const sqlCama = `
                      INSERT INTO cama_ardente (cortina, tapete, livropre, veleiro, cristo, biblia, cavalete)
                      VALUES (?, ?, ?, ?, ?, ?, ?)
                    `;
                    db.query(
                      sqlCama,
                      [
                        cortina ? 1 : 0,
                        tapete ? 1 : 0,
                        livropre ? 1 : 0,
                        veleiro ? 1 : 0,
                        cristo ? 1 : 0,
                        biblia ? 1 : 0,
                        cavalete ? 1 : 0,
                      ],
                      (err, resultCama) => {
                        if (err) return res.status(500).send("Erro ao salvar cama ardente.");
                        const camaId = resultCama.insertId;

                        // 6️⃣ Formulário principal
                        let horarioInt = horario ? parseInt(horario.replace(':','')) : null;
                        const sqlForm = `
                          INSERT INTO formulario
                          (cremacao, horario, translado, necromaquiagem, laboratorio, cama_ardente, endereco_id, usuario_id, falecido_id)
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `;
                        db.query(
                          sqlForm,
                          [cremacao ? 1 : 0, horarioInt, translado || null, necroId, labId, camaId, enderecoId, req.session.user.id, falecidoId],
                          (err, resultForm) => {
                            if (err) return res.status(500).send("Erro ao salvar formulário.");
                            const formId = resultForm.insertId;

                            // 7️⃣ Contrato
                            const sqlContrata = `
                              INSERT INTO contrata (valor, hora, data, assinatura, forma_de_pagamento, cliente, pedido_id)
                              VALUES (?, ?, NOW(), 1, ?, ?, ?)
                            `;
                            const valor = 0; // ajuste conforme sua lógica
                            db.query(
                              sqlContrata,
                              [valor, horarioInt, forma_de_pagamento, cliente, pedidoId],
                              (err) => {
                                if (err) return res.status(500).send("Erro ao salvar contrato.");

                                // 8️⃣ Atualizar status e gerar PDF
                                Pedido.atualizarStatus(pedidoId, "finalizado", async (err) => {
                                  if (err) return res.status(500).send("Erro ao finalizar pedido.");
                                  try { await gerarPdfPedido(pedidoId); } 
                                  catch (pdfErr) { console.error("Erro ao gerar PDF:", pdfErr); }
                                  req.session.pedido_id = null;
                                  res.redirect("/pedidos");
                                });
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  }
);

module.exports = router;
