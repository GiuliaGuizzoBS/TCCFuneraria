const express = require("express");
const router = express.Router();
const db = require("../config/db"); // conexão mysql2

// GET -> Renderiza formulário com selects preenchidos
router.get("/", (req, res) => {
    const sqlFP = "SELECT * FROM forma_de_pagamento";
    const sqlUsers = "SELECT id, username FROM users";

    db.query(sqlFP, (err, formas) => {
        if (err) return res.status(500).send("Erro ao carregar formas de pagamento");

        db.query(sqlUsers, (err2, usuarios) => {
            if (err2) return res.status(500).send("Erro ao carregar usuários");

            res.render("formulario", { formasPagamento: formas, usuarios: usuarios });
        });
    });
});

// POST -> Salva nas tabelas relacionadas
router.post("/", (req, res) => {
    const {
        numero, rua, bairro, cidade, estado, pais,
        roupa, r_intimas, batom, unha, observacao, intensidade,
        embacamento, tanatopraxia, aspiracao, restauracao, mumificacao, higienizacao,
        cortina, tapete, livropre, veleiro, cristo, biblia, cavalete,
        valor, hora, data, forma_de_pagamento, cliente
    } = req.body;

    // Inserir endereço
    const sqlEndereco = "INSERT INTO endereco (numero, rua, bairro, cidade, estado, pais) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sqlEndereco, [numero, rua, bairro, cidade, estado, pais], (err, resultEnd) => {
        if (err) return res.status(500).send("Erro ao salvar endereço");

        // Inserir necromaquiagem
        const sqlNecro = "INSERT INTO necromaquiagem (roupa, r_intimas, batom, unha, observacao, intensidade) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(sqlNecro, [roupa, r_intimas, batom, unha, observacao, intensidade], (err2, resultNecro) => {
            if (err2) return res.status(500).send("Erro ao salvar necromaquiagem");

            // Inserir laboratório
            const sqlLab = "INSERT INTO laboratorio (embacamento, tanatopraxia, aspiracao, restauracao, mumificacao, higienizacao) VALUES (?, ?, ?, ?, ?, ?)";
            db.query(sqlLab, [embacamento, tanatopraxia, aspiracao, restauracao, mumificacao, higienizacao], (err3, resultLab) => {
                if (err3) return res.status(500).send("Erro ao salvar laboratório");

                // Inserir cama ardente
                const sqlCama = "INSERT INTO cama_ardente (cortina, tapete, livropre, veleiro, cristo, biblia, cavalete) VALUES (?, ?, ?, ?, ?, ?, ?)";
                db.query(sqlCama, [cortina, tapete, livropre, veleiro, cristo, biblia, cavalete], (err4, resultCama) => {
                    if (err4) return res.status(500).send("Erro ao salvar cama ardente");

                    // Inserir formulário (ligando necro/lab/cama)
                    const sqlForm = "INSERT INTO formulario (cremacao, horario, translado, necromaquiagem, laboratorio, cama_ardente) VALUES (?, ?, ?, ?, ?, ?)";
                    db.query(sqlForm, [0, hora, "Não informado", resultNecro.insertId, resultLab.insertId, resultCama.insertId], (err5, resultForm) => {
                        if (err5) return res.status(500).send("Erro ao salvar formulário");

                        // Inserir contrato
                        const sqlContrata = "INSERT INTO contrata (valor, hora, data, forma_de_pagamento, cliente) VALUES (?, ?, ?, ?, ?)";
                        db.query(sqlContrata, [valor, hora, data, forma_de_pagamento, cliente], (err6) => {
                            if (err6) return res.status(500).send("Erro ao salvar contrato");

                            res.redirect("/formulario");
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;
