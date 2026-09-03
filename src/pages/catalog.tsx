import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getJson } from '../lib/api';
import { formatCFA } from '../lib/format';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Catalog() {
  const [docs, setDocs] = useState<any[]>([]);

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
      // redirect to cart
      router.push('/cart');
    }catch(e){
      console.error(e);
      alert('Impossible d\'ajouter au panier');
    }
  }

  function reserveFromCatalog(d: any){
    try{
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      // mark as reservation
      cart.push({ documentId: d.id, quantity: 1, reserved: true });
      localStorage.setItem('cart', JSON.stringify(cart));
      router.push('/cart');
    }catch(e){ console.error(e); alert('Impossible de réserver'); }
  }

  return (
    <main className="container py-6">
      <h1 className="text-2xl font-bold mb-4 text-midnight-50">Catalogue</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((d) => (
          <Card key={d.id}>
            <h3 className="text-lg font-semibold text-midnight-50">{d.title}</h3>
            <div className="text-sm text-midnight-200 mb-2">{d.author} — {formatCFA(d.price)}</div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-midnight-300">Stock: {d.stock}</div>
              <div className="flex gap-2">
                <Button onClick={() => addToCart(d)}>Ajouter au panier</Button>
                <Button onClick={() => reserveFromCatalog(d)} variant="ghost">Réserver</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
