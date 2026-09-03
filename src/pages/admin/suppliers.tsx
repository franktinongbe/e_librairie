import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getJson, postJson } from '../../lib/api';

export default function AdminSuppliers(){
  const [suppliers,setSuppliers]=useState<any[]>([]);
  const [name,setName]=useState('');

  async function load(){
    try{ const s = await getJson('/api/suppliers'); setSuppliers(s||[]); }catch(e:any){}
  }
  useEffect(()=>{ load(); },[]);

  async function create(e:any){ e.preventDefault(); try{ await postJson('/api/suppliers',{ name }); setName(''); await load(); }catch(e:any){} }

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-4 text-midnight-50">Fournisseurs</h1>
        <form onSubmit={create} className="mb-4 flex gap-2">
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nom" className="p-2 rounded bg-midnight-800 border border-midnight-700 text-midnight-50" />
          <button className="px-3 py-2 bg-midnight-500 text-white rounded">Créer</button>
        </form>
        <ul className="space-y-2">
          {suppliers.map(s=> <li key={s.id} className="p-2 rounded bg-midnight-800 border border-midnight-700">{s.name}</li>)}
        </ul>
      </div>
    </Layout>
  );
}
