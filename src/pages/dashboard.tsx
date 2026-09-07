import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';

type Stats = { documents: number; reservations: number };

export default function Dashboard(){
  const [stats,setStats] = useState<Stats | null>(null);
  const [docs,setDocs] = useState<any[]>([]);

  useEffect(()=>{
    async function load(){
      try{
        const [docsRes, resRes] = await Promise.all([fetch('/api/documents'), fetch('/api/reservations')]);
        const docsJson = await docsRes.json();
        const resJson = await resRes.json();
        setDocs(docsJson || []);
        setStats({ documents: Array.isArray(docsJson)?docsJson.length:0, reservations: Array.isArray(resJson)?resJson.length:0 });
      }catch(e){
        console.error(e);
      }
    }
    load();
  },[]);

  return (
    <Layout>
      <div className="container py-8 md:py-10">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-amber-400">Tableau de bord</p>
        <h2 className="mb-5 text-3xl font-bold text-ink-700">Vue d’ensemble</h2>
        {stats ? (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <div className="text-sm uppercase tracking-[0.18em] text-amber-400">Documents</div>
              <div className="mt-2 text-3xl font-bold text-ink-700">{stats.documents}</div>
            </Card>
            <Card className="p-5">
              <div className="text-sm uppercase tracking-[0.18em] text-amber-400">Réservations</div>
              <div className="mt-2 text-3xl font-bold text-ink-700">{stats.reservations}</div>
            </Card>
          </div>
        ) : (
          <div className="mb-6 rounded-[24px] border border-ink-100 bg-white/80 p-4 text-ink-500">Chargement...</div>
        )}

        <h3 className="mb-3 text-xl font-semibold text-ink-700">Derniers documents</h3>
        <div className="overflow-x-auto rounded-[24px] border border-ink-100 bg-white/80 p-2 shadow-[0_16px_40px_rgba(34,29,26,0.04)]">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-ink-100 text-left text-sm uppercase tracking-[0.12em] text-ink-400">
                <th className="px-3 py-2">Id</th>
                <th className="px-3 py-2">Titre</th>
                <th className="px-3 py-2">Auteur</th>
                <th className="px-3 py-2">Stock</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id} className="border-b last:border-b-0 border-ink-100">
                  <td className="px-3 py-2 text-ink-500">{d.id}</td>
                  <td className="px-3 py-2 font-medium text-ink-700">{d.title}</td>
                  <td className="px-3 py-2 text-ink-500">{d.author || '-'}</td>
                  <td className="px-3 py-2 text-ink-500">{d.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
