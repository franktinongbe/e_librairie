import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getJson } from '../lib/api';
import { formatCFA } from '../lib/format';

export default function SalesPage(){
  const [sales, setSales] = useState<any[] | null>(null);
  const [err, setErr] = useState('');
  const [sendingId, setSendingId] = useState<number | null>(null);

  useEffect(()=>{
    loadSales();
  },[]);

  const loadSales = async () => {
    try {
      const list = await getJson('/api/sales');
      setSales(list || []);
    } catch (e:any) {
      setErr(e.message||'Erreur');
      setSales([]);
    }
  };

  const sendInvoice = async (saleId: number, invoiceId: number) => {
    try {
      setSendingId(invoiceId);
      const res = await fetch(`/api/invoices/${invoiceId}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Envoi impossible');
      alert('La facture a bien été envoyée par email.');
      await loadSales();
    } catch (e:any) {
      alert(e.message || 'Erreur lors de l’envoi');
    } finally {
      setSendingId(null);
    }
  };

  return (
    <Layout>
      <div className="container py-8 md:py-10">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-amber-400">Ventes</p>
        <h1 className="mb-6 text-3xl font-bold text-ink-700">Historique des ventes</h1>
        {err && <div className="mb-3 rounded-full bg-red-50 px-3 py-2 text-sm text-red-600">{err}</div>}
        {sales === null && <Card className="p-5 text-ink-500">Chargement...</Card>}
        {sales && sales.length === 0 && <Card className="p-5 text-ink-500">Aucune vente trouvée</Card>}
        <div className="space-y-3">
          {sales && sales.map((s:any)=> (
            <Card key={s.id} className="p-5">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <div className="font-semibold text-ink-700">Commande #{s.id} — {new Date(s.createdAt).toLocaleString()}</div>
                  <div className="text-sm text-ink-500">Client: {s.customerName || '—'} </div>
                  <div className="text-sm text-ink-500">Email: {s.customerEmail || '—'}</div>
                  <div className="text-sm text-ink-500">Téléphone: {s.customerPhone || '—'}</div>
                  <div className="text-sm text-ink-500">Adresse: {s.customerAddress || '—'}</div>
                  <div className="text-sm text-ink-500">Items: {s.items?.length || 0}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-ink-700">{formatCFA(s.total)}</div>
                  <div className="mt-3 flex flex-wrap gap-2 justify-end">
                    {s.invoice?.id && (
                      <>
                        <a href={`/api/invoices/${s.invoice.id}`} target="_blank" rel="noreferrer">
                          <Button variant="outline">Télécharger</Button>
                        </a>
                        <Button
                          variant="primary"
                          onClick={() => sendInvoice(s.id, s.invoice.id)}
                          disabled={sendingId === s.invoice.id}
                        >
                          {sendingId === s.invoice.id ? 'Envoi...' : 'Envoyer la facture'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
