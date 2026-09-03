import { useEffect, useState } from 'react';
import { getJson } from '../lib/api';
import { formatCFA } from '../lib/format';
import Link from 'next/link';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Cart() {
  const [cart, setCart] = useState<any[]>([]);
  const [docsMap, setDocsMap] = useState<Record<number, any>>({});

  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(c);
    } catch (e) {
      setCart([]);
    }
    getJson('/api/documents')
      .then((docs) => setDocsMap(Object.fromEntries(docs.map((d: any) => [d.id, d]))))
      .catch((err) => {
        console.error(err);
        setDocsMap({});
      });
  }, []);

  const total = cart.reduce((acc, it) => acc + (docsMap[it.documentId]?.price || 0) * it.quantity, 0);

  return (
    <main className="container py-6">
      <h1 className="text-2xl font-bold mb-4 text-midnight-50">Panier</h1>
      <div className="space-y-4">
        {cart.length === 0 && <Card>Aucun article dans le panier</Card>}
        {cart.map((it, idx) => (
          <Card key={idx} className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-midnight-50">{docsMap[it.documentId]?.title || it.documentId}</div>
              <div className="text-sm text-midnight-300">Qty: {it.quantity}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-midnight-200 mr-4">{formatCFA((docsMap[it.documentId]?.price||0)*it.quantity)}</div>
              <Button onClick={() => {
                const newCart = cart.filter((_,i)=>i!==idx);
                setCart(newCart);
                localStorage.setItem('cart', JSON.stringify(newCart));
              }}>Supprimer</Button>
            </div>
          </Card>
        ))}
        <div className="text-right text-midnight-200">Total: <span className="text-midnight-50 font-medium">{formatCFA(total)}</span></div>
        <div className="text-right">
          <Link href="/checkout" className="btn btn-primary">Passer commande</Link>
        </div>
      </div>
    </main>
  );
}
