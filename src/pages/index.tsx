import Head from 'next/head';
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getJson } from '../lib/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatCFA } from '../lib/format';

export default function Home() {
  const [health, setHealth] = useState<string>('...');
  const [categories, setCategories] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((j) => setHealth(String(j.status)))
      .catch(() => setHealth('unavailable'));

    getJson('/api/categories').then((c:any)=>setCategories(c||[])).catch(()=>setCategories([]));
    getJson('/api/documents').then((d:any)=>setDocs((d||[]).slice(0,6))).catch(()=>setDocs([]));
  }, []);

  function onSearch(e?: any) {
    if (e && e.preventDefault) e.preventDefault();
    router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : '/catalog');
  }

  return (
    <Layout withSidebar={false}>
      <Head>
        <title>E-Library</title>
      </Head>

      <div className="container py-12">
        <div className="max-w-5xl mx-auto">
          <section className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold mb-3 text-midnight-50">E-Library — Librairie numérique</h1>
            <p className="text-midnight-200 mb-6">Trouvez, réservez ou achetez des documents facilement. Parcourez notre catalogue et gérez vos réservations.</p>
            <form onSubmit={onSearch} className="flex items-center justify-center gap-3">
              <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Rechercher un titre, auteur, ISBN..." className="w-2/3 p-3 rounded-md bg-midnight-800 border border-midnight-700 text-midnight-50" />
              <Button type="submit">Rechercher</Button>
            </form>
            <div className="flex items-center justify-center gap-3 mt-4">
              <Link href="/catalog"><Button variant="ghost">Voir le catalogue</Button></Link>
              <Link href="/cart"><Button variant="ghost">Mon panier</Button></Link>
              <Link href="/login"><Button variant="outline">Connexion</Button></Link>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <h3 className="font-semibold mb-2">Statut du service</h3>
              <div className="text-midnight-200">{health}</div>
            </Card>
            <Card>
              <h3 className="font-semibold mb-2">Catégories</h3>
              <ul className="space-y-2">
                {categories.slice(0,5).map(c=> (
                  <li key={c.id}><Link href={`/catalog?category=${c.id}`} className="text-midnight-50">{c.name} <span className="text-sm text-midnight-300">({(c.documents||[]).length})</span></Link></li>
                ))}
              </ul>
            </Card>
            <Card>
              <h3 className="font-semibold mb-2">Mises en avant</h3>
              <div className="space-y-2">
                {docs.map(d=> (
                  <div key={d.id} className="flex items-center gap-3">
                    <div className="w-12 h-16 bg-midnight-900 rounded overflow-hidden flex items-center justify-center">
                      {d.image ? <img src={d.image} alt={d.title} className="object-cover w-full h-full" /> : <div className="text-sm text-midnight-300">No image</div>}
                    </div>
                    <div>
                      <div className="font-medium text-midnight-50">{d.title}</div>
                      <div className="text-sm text-midnight-300">{formatCFA(d.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-midnight-50">Nouveautés</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {docs.map(d=> (
                <Card key={d.id} className="flex flex-col">
                  <div className="h-48 bg-midnight-900 rounded overflow-hidden mb-3">
                    {d.image ? <img src={d.image} alt={d.title} className="object-contain w-full h-full" /> : <div className="p-6 text-midnight-300">Aucune image</div>}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-midnight-50 mb-1">{d.title}</div>
                    <div className="text-sm text-midnight-300 mb-3">{d.author}</div>
                    <div className="text-sm text-midnight-200">Prix: <span className="text-midnight-50">{formatCFA(d.price)}</span></div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/documents/${d.id}`}><Button>Voir</Button></Link>
                    <Link href="/cart"><Button variant="ghost">Réserver / Ajouter</Button></Link>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
