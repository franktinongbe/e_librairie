import { useEffect, useState } from 'react';
import { getJson } from '../lib/api';
import { formatCFA } from '../lib/format';
import Link from 'next/link';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Cart() {
  const [cart, setCart] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [docsMap, setDocsMap] = useState<Record<number, any>>({});

  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(c);
    } catch (e) {
      setCart([]);
    }
    getJson('/api/documents')
      .then((documents) => {
        setDocs(documents || []);
        setDocsMap(Object.fromEntries((documents || []).map((d: any) => [d.id, d])));
      })
      .catch((err) => {
        console.error(err);
        setDocs([]);
        setDocsMap({});
      });
  }, []);

  const total = cart.reduce((acc, it) => acc + (docsMap[it.documentId]?.price || 0) * it.quantity, 0);

  const cartIds = new Set(cart.map((it) => Number(it.documentId)));
  const recommendationPool = docs.filter((d) => !cartIds.has(Number(d.id)));
  const recommended = recommendationPool
    .sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0))
    .slice(0, 3);

  function addToCart(d: any) {
    const nextCart = [...cart, { documentId: d.id, quantity: 1 }];
    setCart(nextCart);
    localStorage.setItem('cart', JSON.stringify(nextCart));
  }

  return (
    <main className="container py-8 md:py-10">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-amber-400">Panier</p>
      <h1 className="mb-6 text-3xl font-bold text-ink-700">Votre sélection</h1>
      <div className="space-y-4">
        {cart.length === 0 && <Card className="p-5 text-ink-500">Aucun article dans le panier</Card>}
        {cart.map((it, idx) => (
          <Card key={idx} className="flex flex-col items-start justify-between gap-3 p-5 md:flex-row md:items-center">
            <div>
              <div className="font-semibold text-ink-700">{docsMap[it.documentId]?.title || it.documentId}</div>
              <div className="text-sm text-ink-500">Qty: {it.quantity}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="mr-2 text-lg font-semibold text-ink-700">{formatCFA((docsMap[it.documentId]?.price||0)*it.quantity)}</div>
              <Button onClick={() => {
                const newCart = cart.filter((_,i)=>i!==idx);
                setCart(newCart);
                localStorage.setItem('cart', JSON.stringify(newCart));
              }} variant="outline">Supprimer</Button>
            </div>
          </Card>
        ))}
        <div className="text-right text-ink-600">Total: <span className="text-xl font-bold text-ink-700">{formatCFA(total)}</span></div>
        <div className="text-right">
          <Link href="/checkout"><Button>Passer commande</Button></Link>
        </div>
      </div>

      {recommended.length > 0 && (
        <div className="mt-10">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-amber-400">Suggestions</p>
          <h2 className="mb-4 text-2xl font-bold text-ink-700">Complétez votre panier</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {recommended.map((d) => (
              <Card key={d.id} className="p-4">
                <div className="mb-3 h-40 overflow-hidden rounded-2xl bg-paper-100">
                  {d.image ? (
                    <img src={d.image} alt={d.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-ink-300">Aucune image</div>
                  )}
                </div>
                <div className="text-sm uppercase tracking-[0.18em] text-amber-400">Livre recommandé</div>
                <h3 className="mt-2 text-lg font-semibold text-ink-700">{d.title}</h3>
                <div className="mt-1 text-sm text-ink-500">{d.author || 'Auteur inconnu'} • {d.pageCount ? `${d.pageCount} pages` : 'pages non spécifiées'}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold text-ink-700">{formatCFA(d.price)}</span>
                  <Button onClick={() => addToCart(d)} variant="outline">Ajouter</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
