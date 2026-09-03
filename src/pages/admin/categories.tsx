import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { getJson, postJson, putJson, deleteJson } from '../../lib/api';

export default function AdminCategories(){
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  async function load(){
    try{
      const c = await getJson('/api/categories');
      setCategories(c || []);
    }catch(e:any){ setErr(e.message||'Erreur'); }
  }

  useEffect(()=>{ load(); },[]);

  async function create(e:any){
    e.preventDefault();
    setErr(''); setMsg('');
    if (!name) return setErr('Nom requis');
    try{
      await postJson('/api/categories', { name });
      setName('');
      setMsg('Catégorie créée');
      await load();
    }catch(e:any){ setErr(e.message||'Erreur'); }
  }

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-4 text-midnight-50">Gestion des catégories</h1>
        {err && <div className="mb-3 text-red-400">{err}</div>}
        {msg && <div className="mb-3 text-green-400">{msg}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <form onSubmit={create} className="space-y-3">
                <Input label="Nom" value={name} onChange={(e)=>setName(e.target.value)} />
                <div className="flex gap-2">
                  <Button type="submit">Créer</Button>
                  <Button type="button" variant="ghost" onClick={()=>setName('')}>Annuler</Button>
                </div>
              </form>
            </Card>
          </div>

          <div className="md:col-span-2">
            <h2 className="font-semibold text-midnight-50 mb-3">Liste des catégories</h2>
            <div className="space-y-3">
              {categories.map((c:any)=>(
                <Card key={c.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-midnight-50">{c.name}</div>
                    <div className="text-sm text-midnight-300">{(c.documents||[]).length} articles</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={async ()=>{
                      const newName = prompt('Renommer la catégorie', c.name);
                      if (!newName) return;
                        try{
                          await putJson('/api/categories', { id: c.id, name: newName });
                          await load();
                        }catch(e:any){ setErr(e.message||'Erreur'); }
                    }} className="px-2 py-1 bg-midnight-500 text-white rounded">Éditer</button>
                    <button onClick={async ()=>{
                      if (!confirm('Supprimer la catégorie ?')) return;
                      try{
                        await deleteJson('/api/categories', { id: c.id });
                        await load();
                      }catch(e:any){ setErr(e.message||'Erreur'); }
                    }} className="px-2 py-1 bg-red-600 text-white rounded">Supprimer</button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
