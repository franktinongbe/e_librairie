import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import PageHeader from '../../components/ui/PageHeader';
import { getJson } from '../../lib/api';

export default function AdminInvoices(){
  const [invoices,setInvoices]=useState<any[]>([]);

  useEffect(()=>{ getJson('/api/sales').then((list:any)=>{
    // flatten invoices from sales
    const invs = list.map((s:any)=> ({ id: s.invoice?.id, saleId: s.id, total: s.total, createdAt: s.createdAt, customerEmail: s.customerEmail }));
    setInvoices(invs.filter((i:any)=>i.id));
  }).catch(console.error); },[]);

  return (
    <Layout>
      <div className="container py-6">
        <PageHeader title="Factures" backHref="/admin" />
        <ul className="space-y-3">
          {invoices.map(inv=> (
            <div key={inv.id} className="p-3 rounded bg-ink-700 border border-ink-700 flex justify-between items-center">
              <div>
                <div className="text-ink-50">Facture #{inv.id} — Commande #{inv.saleId} — {inv.customerEmail || '—'}</div>
                <div className="text-sm text-ink-300">Créée: {new Date(inv.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <a href={`/api/invoices/${inv.id}`} className="px-3 py-1 bg-ink-500 text-white rounded">Télécharger</a>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
