import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getJson, postJson } from '../../lib/api';

export default function AdminMovements(){
  const [movements,setMovements]=useState<any[]>([]);
  const [articleId,setArticleId]=useState('');
  const [quantity,setQuantity]=useState('0');
  const [type,setType]=useState('ENTREE');

  async function load(){
    try{ const m = await getJson('/api/movements'); setMovements(m||[]); }catch(e:any){}
  }
  useEffect(()=>{ load(); },[]);

  async function create(e:any){ e.preventDefault(); try{ await postJson('/api/movements',{ articleId: Number(articleId), quantity: Number(quantity), type }); setArticleId(''); setQuantity('0'); await load(); }catch(e:any){} }

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-4 text-midnight-50">Mouvements</h1>
        <form onSubmit={create} className="mb-4 space-y-2">
          <input value={articleId} onChange={(e)=>setArticleId(e.target.value)} placeholder="Article ID" className="p-2 rounded bg-midnight-800 border border-midnight-700 text-midnight-50" />
          <input value={quantity} onChange={(e)=>setQuantity(e.target.value)} placeholder="Quantité" className="p-2 rounded bg-midnight-800 border border-midnight-700 text-midnight-50" />
          <select value={type} onChange={(e)=>setType(e.target.value)} className="p-2 rounded bg-midnight-800 border border-midnight-700 text-midnight-50">
            <option>ENTREE</option>
            <option>SORTIE</option>
            <option>VENTE</option>
            <option>RETOUR</option>
            <option>AJUSTEMENT</option>
          </select>
          <button className="px-3 py-2 bg-midnight-500 text-white rounded">Créer</button>
        </form>
        <ul className="space-y-2">
          {movements.map(m=> <li key={m.id} className="p-2 rounded bg-midnight-800 border border-midnight-700">{m.type} — {m.quantity} (Article {m.articleId})</li>)}
        </ul>
      </div>
    </Layout>
  );
}
