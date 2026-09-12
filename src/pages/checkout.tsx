import { useEffect, useState } from 'react';
import { getJson, postJson } from '../lib/api';
import { useRouter } from 'next/router';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Checkout() {
  const [cart, setCart] = useState<any[]>([]);
  const [docsMap, setDocsMap] = useState<Record<number, any>>({});
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(c);
    getJson('/api/documents').then((docs) => setDocsMap(Object.fromEntries(docs.map((d: any) => [d.id, d]))));
  }, []);

  async function submit() {
    try {
      const res = await postJson('/api/sales/create', {
        items: cart,
        customerName,
        customerPhone,
        customerAddress,
        customerEmail: email,
      });
      localStorage.removeItem('cart');
      router.push(`/order-confirmation?saleId=${res.saleId}`);
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  }

  return (
    <main className="container py-6">
      <h1 className="text-2xl font-bold mb-4 text-ink-50">Paiement</h1>
      <Card>
        <div className="space-y-4">
          <Input label="Nom du client" value={customerName} onChange={(e)=>setCustomerName(e.target.value)} />
          <Input label="Téléphone" value={customerPhone} onChange={(e)=>setCustomerPhone(e.target.value)} />
          <Input label="Adresse" value={customerAddress} onChange={(e)=>setCustomerAddress(e.target.value)} />
          <Input label="Email client" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <div className="text-right">
            <Button onClick={submit}>Valider la commande</Button>
          </div>
        </div>
      </Card>
    </main>
  );
}
