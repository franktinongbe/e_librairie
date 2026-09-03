export function orderConfirmationTemplate(sale: any, saleWithItems: any) {
  const subject = `Votre commande #${sale.id} — Merci de votre achat`;

  const lines = [
    `Bonjour,`,
    ``,
    `Merci pour votre commande. Détails :`,
    `Commande #${sale.id}`,
    `Total: ${sale.total} €`,
    ``,
    `Articles :`
  ];

  const itemsHtml = saleWithItems.items
    .map((it: any) => `<tr><td>${it.document?.title || it.documentId}</td><td>${it.quantity}</td><td>${it.unitPrice}€</td></tr>`)
    .join('');

  const text = lines.concat(
    saleWithItems.items.map((it: any) => `- ${it.document?.title || it.documentId} x${it.quantity} @ ${it.unitPrice}€`)
  ).join('\n');

  const html = `
    <html>
      <body>
        <p>Bonjour,</p>
        <p>Merci pour votre commande. Détails :</p>
        <p><strong>Commande #${sale.id}</strong><br/>Total: <strong>${sale.total} €</strong></p>
        <table border="1" cellpadding="6" cellspacing="0">
          <thead><tr><th>Article</th><th>Quantité</th><th>Prix unitaire</th></tr></thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p>Merci,<br/>L'équipe E-Library</p>
      </body>
    </html>
  `;

  return { subject, text, html };
}
