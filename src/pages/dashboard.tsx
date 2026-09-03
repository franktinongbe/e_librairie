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
      <div className="container py-6">
        <h2 className="text-2xl font-semibold mb-4 text-midnight-50">Tableau de bord</h2>
        {stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Card>Documents: <div className="text-2xl font-bold mt-2 text-midnight-50">{stats.documents}</div></Card>
            <Card>Réservations: <div className="text-2xl font-bold mt-2 text-midnight-50">{stats.reservations}</div></Card>
          </div>
        ) : (
          <div>Chargement...</div>
        )}

        <h3 className="text-lg font-medium mb-2 text-midnight-50">Derniers documents</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left border-b border-midnight-700">
                <th className="px-3 py-2">Id</th>
                <th className="px-3 py-2">Titre</th>
                <th className="px-3 py-2">Auteur</th>
                <th className="px-3 py-2">Stock</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id} className="border-b last:border-b-0 border-midnight-700">
                  <td className="px-3 py-2">{d.id}</td>
                  <td className="px-3 py-2 text-midnight-50">{d.title}</td>
                  <td className="px-3 py-2">{d.author || '-'}</td>
                  <td className="px-3 py-2">{d.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
