import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getJson } from '../lib/api';
import { formatCFA } from '../lib/format';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import Layout from '../components/Layout';

export default function Catalog() {
  const [docs, setDocs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    // load categories once
    getJson('/api/categories').then((c) => setCategories(c)).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    // load documents for selected category (server-side filter)
    const q = selectedCat ? `/api/documents?categoryId=${selectedCat}` : '/api/documents';
    getJson(q).then(setDocs).catch((err) => { console.error(err); setDocs([]); });
  }, [selectedCat]);

  function addToCart(d: any){
    try{
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push({ documentId: d.id, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(cart));
      router.push('/cart');
    }catch(e){
      console.error(e);
      alert('Impossible d\'ajouter au panier');
    }
  }

  function reserveFromCatalog(d: any){
    try{
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push({ documentId: d.id, quantity: 1, reserved: true });
      localStorage.setItem('cart', JSON.stringify(cart));
      router.push('/cart');
    }catch(e){ console.error(e); alert('Impossible de réserver'); }
  }

  const filtered = docs;

  return (
    <Layout>
      <main className="container py-8 md:py-10">
        <PageHeader
          insideContainer
          subtitle={<p className="mb-2 text-xs uppercase tracking-[0.2em] text-amber-600">Catalogue</p>}
          title="Nos éditions"
        />

        {/* Categories filter */}
        <div className="mb-6 flex items-center gap-3 overflow-x-auto py-2" role="tablist" aria-label="Filtres de catégories">
          <button
            onClick={() => setSelectedCat(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${!selectedCat ? 'bg-amber-500 text-white' : 'bg-paper-50 text-ink-800'}`}
            aria-pressed={!selectedCat}
            aria-label="Afficher tous les documents"
          >
            Tous
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCat === c.id ? 'bg-amber-500 text-white' : 'bg-paper-50 text-ink-800'}`}
              aria-pressed={selectedCat === c.id}
              aria-label={`Filtrer par catégorie ${c.name}`}
            >
              {c.name} ({(c.documents || []).length})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((d) => (
            <Card key={d.id} className="overflow-hidden p-0 shadow-md hover:shadow-lg transition-shadow duration-200 fade-in" role="article" aria-labelledby={`doc-title-${d.id}`}>
              <div className="relative h-64 bg-paper-100">
                {d.image ? (
                  <img src={d.image} alt={d.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-ink-400">Aucune image</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute left-4 bottom-4 right-4">
                  <h3 id={`doc-title-${d.id}`} className="text-xl font-semibold text-white leading-tight">{d.title}</h3>
                  <div className="text-sm text-white/90 mt-1">{d.author || 'Auteur inconnu'}</div>
                </div>
              </div>
              <div className="p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-ink-900">{formatCFA(d.price)}</div>
                  <div className="text-sm text-ink-700">Stock: {d.stock}</div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button onClick={() => addToCart(d)}>Ajouter</Button>
                  <Button onClick={() => reserveFromCatalog(d)} variant="ghost">Réserver</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </Layout>
  );
}
