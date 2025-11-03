const express = require("express");
const router = express.Router();
const db = require("../config/db");
const Pedido = require("../models/pedidosModel");
const { verificarLogin } = require("../middlewares/authMiddleware");
const { gerarPdfPedido } = require("../utils/gerarPdf");
const upload = require("../config/multerConfig");

router.use(verificarLogin);

// Função auxiliar para executar query com Promises
function queryAsync(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

// Exibir formulário
router.get("/", (req, res) => {
  const pedidoId = req.session.pedido_id;
  if (!pedidoId) {
    return res.redirect("/pedidos");
  }
  res.render("formulario", { user: req.session.user });
});

// Salvar formulário e finalizar pedido
router.post(
  "/",
  upload.fields([
    { name: "foto_falecido", maxCount: 1 },
    { name: "comprovante_residencia", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const pedidoId = req.session.pedido_id;
      if (!pedidoId) return res.redirect("/pedidos");

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
        numero_cliente,
        cpf_cliente,
        rg_cliente,
      } = req.body;

      const foto = req.files["foto_falecido"]
        ? req.files["foto_falecido"][0].filename
        : null;
      const comprovante = req.files["comprovante_residencia"]
        ? req.files["comprovante_residencia"][0].filename
        : null;

      // 1️⃣ Falecido
      const resultFalecido = await queryAsync(
        `INSERT INTO falecido (nome, idade, cpf, rg, data_falecimento, local_falecimento, foto, comprovante_residencia)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          falecido_nome,
          falecido_idade || null,
          falecido_cpf || null,
          falecido_rg || null,
          falecido_data_falecimento || null,
          falecido_local_falecimento || null,
          foto,
          comprovante,
        ]
      );
      const falecidoId = resultFalecido.insertId;

      // 2️⃣ Endereço
      const resultEndereco = await queryAsync(
        `INSERT INTO endereco (numero, rua, bairro, cidade, estado, pais)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [numero, rua, bairro, cidade, estado, pais]
      );
      const enderecoId = resultEndereco.insertId;

      // 3️⃣ Necromaquiagem
      const resultNecro = await queryAsync(
        `INSERT INTO necromaquiagem (roupa, r_intimas, batom, unha, observacao, intensidade, cabelo)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [roupa || null, r_intimas || 0, batom || null, unha || null, observacao || null, intensidade || 0, cabelo || null]
      );
      const necroId = resultNecro.insertId;

      // 4️⃣ Laboratório
      const resultLab = await queryAsync(
        `INSERT INTO laboratorio (embacamento, tanatopraxia, aspiracao, restauracao, mumificacao, higienizacao)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          embalsamamento ? 1 : 0,
          tanatopraxia ? 1 : 0,
          aspiracao ? 1 : 0,
          restauracao ? 1 : 0,
          mumificacao ? 1 : 0,
          higienizacao ? 1 : 0,
        ]
      );
      const labId = resultLab.insertId;

      // 5️⃣ Cama Ardente
      const resultCama = await queryAsync(
        `INSERT INTO cama_ardente (cortina, tapete, livropre, veleiro, cristo, biblia, cavalete)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          cortina ? 1 : 0,
          tapete ? 1 : 0,
          livropre ? 1 : 0,
          veleiro ? 1 : 0,
          cristo ? 1 : 0,
          biblia ? 1 : 0,
          cavalete ? 1 : 0,
        ]
      );
      const camaId = resultCama.insertId;

      // 6️⃣ Formulário principal
      const horarioInt = horario ? parseInt(horario.replace(":", "")) : null;
      const resultForm = await queryAsync(
        `INSERT INTO formulario (cremacao, horario, translado, necromaquiagem, laboratorio, cama_ardente, endereco_id, usuario_id, falecido_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [cremacao ? 1 : 0, horarioInt, translado || null, necroId, labId, camaId, enderecoId, req.session.user.id, falecidoId]
      );
      const formId = resultForm.insertId;

      // 7️⃣ Contrato
      const valor = 0;
      await queryAsync(
        `INSERT INTO contrata (valor, hora, data, assinatura, forma_de_pagamento,
         cliente, numero_cliente, cpf_cliente, rg_cliente, pedido_id, formulario_id)
         VALUES (?, ?, NOW(), 1, ?, ?, ?, ?, ?, ?, ?)`,
        [valor, horarioInt, forma_de_pagamento, cliente, numero_cliente, cpf_cliente, rg_cliente, pedidoId, formId]
      );

      // 8️⃣ Atualizar status e gerar PDF
      await Pedido.atualizarStatusAsync(pedidoId, "finalizado");
      await gerarPdfPedido(pedidoId);

      req.session.pedido_id = null;
      res.redirect("/pedidos?sucesso=1");
    } catch (err) {
      console.error("Erro ao salvar formulário:", err);
      res.status(500).send("Ocorreu um erro ao salvar o formulário.");
    }
  }
);

module.exports = router;
