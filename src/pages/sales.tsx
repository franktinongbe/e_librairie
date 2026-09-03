import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import { getJson } from '../lib/api';
import { formatCFA } from '../lib/format';

export default function SalesPage(){
  const [sales, setSales] = useState<any[] | null>(null);
  const [err, setErr] = useState('');

  useEffect(()=>{
    getJson('/api/sales').then(setSales).catch((e:any)=>{
      setErr(e.message||'Erreur');
      setSales([]);
    });
  },[]);

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-4 text-midnight-50">Ventes</h1>
        {err && <div className="text-red-400 mb-3">{err}</div>}
        {sales === null && <Card>Chargement...</Card>}
        {sales && sales.length === 0 && <Card>Aucune vente trouvée</Card>}
        <div className="space-y-3">
          {sales && sales.map((s:any)=> (
            <Card key={s.id}>
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">Commande #{s.id} — {new Date(s.createdAt).toLocaleString()}</div>
                  <div className="text-sm text-midnight-300">Client: {s.customerEmail || '—'}</div>
                  <div className="text-sm text-midnight-300">Items: {s.items?.length || 0}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCFA(s.total)}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
