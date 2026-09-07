import { documentCreateSchema } from '../src/lib/validators';

describe('documentCreateSchema', () => {
  it('accepts author and pageCount for a new document', () => {
    const doc = documentCreateSchema.parse({
      title: 'Le premier homme',
      author: 'Albert Camus',
      pageCount: 224,
      price: 8500,
      stock: 12,
      categoryId: 2
    });

    expect(doc.author).toBe('Albert Camus');
    expect(doc.pageCount).toBe(224);
  });
});
