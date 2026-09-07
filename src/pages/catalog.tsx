import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getJson } from '../lib/api';
import { formatCFA } from '../lib/format';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Catalog() {
  const [docs, setDocs] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    getJson('/api/documents')
      .then(setDocs)
      .catch((err) => {
        console.error(err);
        setDocs([]);
      });
  }, []);

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

  return (
    <main className="container py-8 md:py-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-amber-400">Catalogue</p>
          <h1 className="text-3xl font-bold text-ink-700">Nos éditions</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {docs.map((d) => (
          <Card key={d.id} className="flex h-full flex-col p-5">
            <div className="mb-4 h-52 overflow-hidden rounded-2xl bg-paper-100">
              {d.image ? (
                <img src={d.image} alt={d.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-ink-300">Aucune image</div>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <div className="mb-2 text-xs uppercase tracking-[0.18em] text-amber-400">Edition</div>
              <h3 className="text-xl font-semibold text-ink-700">{d.title}</h3>
              <div className="mt-2 text-sm text-ink-500">{d.author || 'Auteur inconnu'} — {formatCFA(d.price)}</div>
              <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4">
                <div className="text-sm text-ink-500">Stock: {d.stock}</div>
                <div className="flex gap-2">
                  <Button onClick={() => addToCart(d)}>Ajouter</Button>
                  <Button onClick={() => reserveFromCatalog(d)} variant="ghost">Réserver</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
