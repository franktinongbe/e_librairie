import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getJson } from '../lib/api';
import Card from '../components/ui/Card';

export default function OrdersPage(){
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(()=>{
    getJson('/api/sales').then(setOrders).catch(console.error);
  },[]);

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-4 text-midnight-50">Mes commandes</h1>
        <div className="space-y-3">
          {orders.map(o=> (
            <Card key={o.id}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-midnight-50">Commande #{o.id} — {o.total}€</div>
                  <div className="text-sm text-midnight-300">Créée: {new Date(o.createdAt).toLocaleString()}</div>
                </div>
              </div>
              <ul className="mt-3 space-y-1">
                {o.items.map((it:any)=>(
                  <li key={it.id} className="text-midnight-200">{it.document?.title||it.documentId} — qty: {it.quantity} — unit: {it.unitPrice}€</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
