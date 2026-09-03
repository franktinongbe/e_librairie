import { orderConfirmationTemplate } from '../src/lib/emailTemplates';

describe('orderConfirmationTemplate', () => {
  test('renders subject, text and html with items', () => {
    const sale = { id: 42, total: 123.45 };
    const saleWithItems = { items: [{ id: 1, document: { title: 'Livre A' }, quantity: 2, unitPrice: 10 }, { id: 2, document: { title: 'Livre B' }, quantity: 1, unitPrice: 103.45 }] };
    const tpl = orderConfirmationTemplate(sale, saleWithItems as any);
    expect(tpl.subject).toContain('Commande #42');
    expect(tpl.text).toContain('Livre A');
    expect(tpl.html).toContain('<table');
    expect(tpl.html).toContain('Livre B');
  });
});
