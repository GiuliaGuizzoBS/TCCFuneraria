const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const db = require("../config/db");

// 🧩 Função principal
async function gerarPdfPedido(pedidoId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT pe.id, pe.criado_em, c.cliente, c.valor, c.forma_de_pagamento,
             GROUP_CONCAT(CONCAT(p.nome, ' x', pp.quantidade) SEPARATOR ', ') AS produtos
      FROM pedidos pe
      LEFT JOIN contrata c ON c.pedido_id = pe.id
      LEFT JOIN pedido_produtos pp ON pp.pedido_id = pe.id
      LEFT JOIN produtos p ON p.id = pp.produto_id
      WHERE pe.id = ?
      GROUP BY pe.id, c.cliente, c.valor, c.forma_de_pagamento
    `;

    db.query(sql, [pedidoId], (err, results) => {
      if (err || !results[0]) {
        console.error("Erro ao buscar dados do pedido:", err);
        return reject(err || "Pedido não encontrado");
      }

      const p = results[0];
      const pastaPdfs = path.join(__dirname, "../pdfs");
      const caminhoPdf = path.join(pastaPdfs, `pedido_${p.id}.pdf`);

      // Cria pasta se não existir
      if (!fs.existsSync(pastaPdfs)) {
        fs.mkdirSync(pastaPdfs, { recursive: true });
      }

      // Cria o documento PDF
      const doc = new PDFDocument();

      // Salva o PDF no disco
      const stream = fs.createWriteStream(caminhoPdf);
      doc.pipe(stream);

      // Cabeçalho
      doc.fontSize(20).text("Comprovante de Pedido", { align: "center" });
      doc.moveDown(1);
      doc.fontSize(14).text("Funerária Menino Deus", { align: "center" });
      doc.moveDown(2);

      // Dados do pedido
      doc.fontSize(12).text(`Número do Pedido: ${p.id}`);
      doc.text(`Data: ${new Date(p.criado_em).toLocaleDateString("pt-BR")}`);
      doc.text(`Cliente: ${p.cliente}`);
      doc.text(`Forma de Pagamento: ${p.forma_de_pagamento}`);
      doc.moveDown(1);

      // Lista de produtos
      doc.fontSize(12).text("Itens do Pedido:", { underline: true });
      doc.text(p.produtos || "Nenhum produto listado.");
      doc.moveDown(1);

      // Valor total
      doc.fontSize(12).text(`Valor Total: R$ ${Number(p.valor || 0).toFixed(2)}`, { align: "right" });
      doc.moveDown(2);

      // Rodapé
      doc.fontSize(10).text("Agradecemos pela confiança.", { align: "center" });
      doc.text("Funerária Menino Deus © 2025", { align: "center" });

      doc.end();

      stream.on("finish", () => {
        console.log("✅ PDF gerado com sucesso:", caminhoPdf);
        resolve(caminhoPdf);
      });

      stream.on("error", (err) => {
        console.error("Erro ao salvar PDF:", err);
        reject(err);
      });
    });
  });
}

module.exports = { gerarPdfPedido };
